import assert from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import Page from '../models/Page.js';
import Settings from '../models/Settings.js';

async function runPersistenceTests() {
  console.log('🧪 Starting Phase 2 Persistence Verification Tests...\n');
  await connectDB();

  const testSlug = 'test-phase2-persistence-verification';

  try {
    // 1. ISOLATED TEST RECORD CREATION
    console.log('Step 1: Creating isolated test page record');
    await Page.deleteOne({ slug: testSlug });

    const initialPagePayload = {
      slug: testSlug,
      title: 'Phase 2 Test Page',
      subtitle: 'CMS Verification',
      isPublished: true,
      hero: {
        title: 'Test Hero',
        subtitle: 'SUBTITLE',
        description: 'Test description',
        mediaUrl: 'https://example.com/test.jpg',
        resourceType: 'image',
      },
      sections: [
        {
          sectionId: 'sec_test_cards',
          type: 'cards',
          title: 'Test Four Pillars',
          subtitle: 'SUBTITLE',
          items: [
            { id: 'card_1', title: 'Card Alpha', kicker: 'PILLAR 01', description: 'Original Alpha Desc', order: 0, isVisible: true },
            { id: 'card_2', title: 'Card Beta', kicker: 'PILLAR 02', description: 'Original Beta Desc', order: 1, isVisible: true },
            { id: 'card_3', title: 'Card Gamma', kicker: 'PILLAR 03', description: 'Original Gamma Desc', order: 2, isVisible: true },
            { id: 'card_4', title: 'Card Delta', kicker: 'PILLAR 04', description: 'Original Delta Desc', order: 3, isVisible: true },
          ],
        },
      ],
    };

    let savedPage = await Page.create(initialPagePayload);
    assert.strictEqual(savedPage.sections[0].items.length, 4);
    console.log('  ✅ Isolated test page created with 4 test cards.');

    // 2. VERIFY CARD EDIT PERSISTENCE
    console.log('Step 2: Testing Card Edit Persistence');
    const updatePayload = JSON.parse(JSON.stringify(savedPage.toObject()));
    updatePayload.sections[0].items[0].title = 'Card Alpha — Edited & Verified';
    updatePayload.sections[0].items[0].description = 'Updated protocol details for Alpha';

    await Page.findOneAndUpdate({ slug: testSlug }, updatePayload, { new: true });
    
    // Simulate "Page Refresh" by re-querying fresh from MongoDB
    const reloadedPageAfterEdit = await Page.findOne({ slug: testSlug }).lean();
    assert.strictEqual(
      reloadedPageAfterEdit.sections[0].items[0].title,
      'Card Alpha — Edited & Verified',
      'Card edit must persist in database upon re-fetch.'
    );
    assert.strictEqual(
      reloadedPageAfterEdit.sections[0].items[0].description,
      'Updated protocol details for Alpha'
    );
    console.log('  ✅ Card edit persisted and successfully loaded after simulated refresh.');

    // 3. VERIFY CARD REORDERING PERSISTENCE
    console.log('Step 3: Testing Card Reordering Persistence (Move Card 0 Down to Index 1)');
    const reorderPayload = JSON.parse(JSON.stringify(reloadedPageAfterEdit));
    const items = reorderPayload.sections[0].items;
    
    // Swap Card 0 and Card 1
    const temp = items[0];
    items[0] = items[1];
    items[1] = temp;
    reorderPayload.sections[0].items = items.map((it, idx) => ({ ...it, order: idx }));

    await Page.findOneAndUpdate({ slug: testSlug }, reorderPayload, { new: true });

    // Simulate "Page Refresh"
    const reloadedAfterReorder = await Page.findOne({ slug: testSlug }).lean();
    assert.strictEqual(
      reloadedAfterReorder.sections[0].items[0].id,
      'card_2',
      'Card Beta must now be at index 0.'
    );
    assert.strictEqual(
      reloadedAfterReorder.sections[0].items[1].id,
      'card_1',
      'Card Alpha must now be at index 1.'
    );
    console.log('  ✅ Card reordering persisted and verified after reload.');

    // 4. VERIFY VISIBILITY TOGGLE PERSISTENCE
    console.log('Step 4: Testing Card Visibility Toggle Persistence');
    const visPayload = JSON.parse(JSON.stringify(reloadedAfterReorder));
    visPayload.sections[0].items[0].isVisible = false;

    await Page.findOneAndUpdate({ slug: testSlug }, visPayload, { new: true });

    // Simulate "Page Refresh"
    const reloadedAfterVis = await Page.findOne({ slug: testSlug }).lean();
    assert.strictEqual(
      reloadedAfterVis.sections[0].items[0].isVisible,
      false,
      'Card visibility toggle must persist as false.'
    );
    assert.strictEqual(
      reloadedAfterVis.sections[0].items[1].isVisible,
      true,
      'Unmodified card visibility must remain true.'
    );
    console.log('  ✅ Visibility change persisted and verified after reload.');

    // 5. VERIFY CARD ADD & REMOVE PERSISTENCE
    console.log('Step 5: Testing Card Addition and Removal Persistence');
    const addRemovePayload = JSON.parse(JSON.stringify(reloadedAfterVis));
    // Remove last item (card_4)
    addRemovePayload.sections[0].items.pop();
    // Add new item (card_5)
    addRemovePayload.sections[0].items.push({
      id: 'card_5',
      title: 'Card Epsilon (Newly Added)',
      kicker: 'PILLAR 05',
      description: 'Epsilon discipline description',
      order: 3,
      isVisible: true,
    });

    await Page.findOneAndUpdate({ slug: testSlug }, addRemovePayload, { new: true });

    const reloadedAfterAddRemove = await Page.findOne({ slug: testSlug }).lean();
    const finalItems = reloadedAfterAddRemove.sections[0].items;
    assert.strictEqual(finalItems.length, 4);
    assert.ok(finalItems.some(i => i.id === 'card_5'), 'Card 5 must be present.');
    assert.ok(!finalItems.some(i => i.id === 'card_4'), 'Card 4 must be deleted.');
    console.log('  ✅ Card addition and deletion persisted and verified after reload.');

    // 6. VERIFY SETTINGS PERSISTENCE & IMMEDIATE RESTORE
    console.log('Step 6: Testing Settings Persistence & Safe Restoration');
    const originalSettings = await Settings.findOne().lean();
    assert.ok(originalSettings, 'Original settings must exist.');

    // Apply temporary test modification
    const tempTagline = 'Expand Your Light — Verification Probe';
    await Settings.updateOne(
      { _id: originalSettings._id },
      { $set: { 'general.tagline': tempTagline } }
    );

    // Verify persistence after simulated refresh
    const refreshedSettings = await Settings.findOne().lean();
    assert.strictEqual(
      refreshedSettings.general.tagline,
      tempTagline,
      'Settings update must persist upon re-fetch.'
    );

    // Immediately restore original tagline
    await Settings.updateOne(
      { _id: originalSettings._id },
      { $set: { 'general.tagline': originalSettings.general.tagline } }
    );

    const restoredSettings = await Settings.findOne().lean();
    assert.strictEqual(
      restoredSettings.general.tagline,
      originalSettings.general.tagline,
      'Settings must be accurately restored to production state.'
    );
    console.log('  ✅ Settings persistence verified and production values completely restored.');

  } finally {
    // 7. CLEAN UP ISOLATED TEST RECORD
    console.log('Step 7: Cleaning up isolated test page record from MongoDB');
    await Page.deleteOne({ slug: testSlug });
    const checkDeleted = await Page.findOne({ slug: testSlug });
    assert.strictEqual(checkDeleted, null, 'Test page must be completely removed.');
    console.log('  ✅ Temporary test data cleanly purged from database.');
    await mongoose.disconnect();
  }

  console.log('\n🎉 ALL PERSISTENCE TESTS PASSED SUCCESSFULLY!');
}

runPersistenceTests().catch((err) => {
  console.error('❌ Persistence Test Failure:', err);
  process.exit(1);
});
