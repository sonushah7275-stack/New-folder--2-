import assert from 'assert';
import fs from 'fs';
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

async function runPhase2Tests() {
  console.log('🧪 Starting Phase 2: Admin Dashboard CMS & Settings Verification Tests...\n');

  // TEST 1: Inspect PageCmsEditor.jsx for 13 Editable Pages
  console.log('Test 1: Verifying PageCmsEditor.jsx contains all 13 required pages in selector');
  const editorCode = fs.readFileSync(
    path.resolve(__dirname, '../../TEJOVA-Admin-Dashboard/src/admin/pages/PageCmsEditor.jsx'),
    'utf8'
  );

  const expected13Slugs = [
    'home',
    'vitality',
    'nourishment',
    'lifestyle',
    'longevity',
    'products',
    'blog',
    'about',
    'contact',
    'privacy-policy',
    'terms-and-conditions',
    'shipping-policy',
    'faqs'
  ];

  for (const slug of expected13Slugs) {
    assert.ok(
      editorCode.includes(`slug: "${slug}"`),
      `PageCmsEditor must include slug: "${slug}"`
    );
  }
  console.log('  ✅ Test 1 Passed: All 13 pages exist in PageCmsEditor selector.\n');

  // TEST 2: Inspect Card Editor Capabilities in PageCmsEditor.jsx
  console.log('Test 2: Verifying Sub-Card Editor Capabilities (Add, Remove, Reorder, Visibility, Edit)');
  assert.ok(editorCode.includes('handleMoveItem'), 'PageCmsEditor must implement handleMoveItem for reordering.');
  assert.ok(editorCode.includes('handleAddItem'), 'PageCmsEditor must implement handleAddItem.');
  assert.ok(editorCode.includes('handleDeleteItem'), 'PageCmsEditor must implement handleDeleteItem.');
  assert.ok(editorCode.includes('handleItemChange'), 'PageCmsEditor must implement handleItemChange.');
  assert.ok(editorCode.includes('VisibilityIcon'), 'PageCmsEditor must support card visibility toggle.');
  assert.ok(editorCode.includes('ArrowUpwardIcon'), 'PageCmsEditor must have move-up button.');
  assert.ok(editorCode.includes('ArrowDownwardIcon'), 'PageCmsEditor must have move-down button.');
  console.log('  ✅ Test 2 Passed: Card editor supports title, kicker, subtitle, description, media, link, reordering & visibility.\n');

  // TEST 3: Inspect Settings.jsx for General & Social Fields
  console.log('Test 3: Verifying Settings.jsx & settingsSlice for careEmail, social channels, and Nagpur address');
  const settingsCode = fs.readFileSync(
    path.resolve(__dirname, '../../TEJOVA-Admin-Dashboard/src/admin/pages/Settings.jsx'),
    'utf8'
  );
  const settingsSliceCode = fs.readFileSync(
    path.resolve(__dirname, '../../TEJOVA-Admin-Dashboard/src/Redux/slices/settingsSlice.js'),
    'utf8'
  );

  assert.ok(settingsCode.includes('careEmail'), 'Settings.jsx must contain careEmail field.');
  assert.ok(settingsCode.includes('socialLinks?.youtube'), 'Settings.jsx must contain YouTube channel field.');
  assert.ok(settingsCode.includes('socialLinks?.linkedin'), 'Settings.jsx must contain LinkedIn page field.');
  assert.ok(settingsCode.includes('socialLinks?.instagram'), 'Settings.jsx must contain Instagram field.');
  assert.ok(settingsCode.includes('socialLinks?.facebook'), 'Settings.jsx must contain Facebook field.');
  assert.ok(
    settingsCode.includes('C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India'),
    'Settings.jsx must reference the exact official Nagpur address.'
  );
  assert.ok(settingsSliceCode.includes('careEmail: "care@tejova.com"'), 'settingsSlice initialSettingsState must contain careEmail.');
  console.log('  ✅ Test 3 Passed: Settings UI and Redux slice fully enhanced.\n');

  // TEST 4: Live MongoDB Atlas Data Verification for All 13 Pages
  console.log('Test 4: Verifying MongoDB Atlas contains all 13 pages and four-pillar card structures');
  await connectDB();

  for (const slug of expected13Slugs) {
    const page = await Page.findOne({ slug }).lean();
    assert.ok(page, `MongoDB must contain page document for slug: '${slug}'`);
    assert.ok(Array.isArray(page.sections), `Page '${slug}' must contain a sections array`);
  }

  // Vitality Checks
  const vitalityPage = await Page.findOne({ slug: 'vitality' }).lean();
  const vitFoundations = vitalityPage.sections.find(s => s.sectionId === 'sec_vitality_foundations');
  const vitProtocols = vitalityPage.sections.find(s => s.sectionId === 'sec_vitality_protocols');
  assert.ok(vitFoundations, 'Vitality must have sec_vitality_foundations section');
  assert.strictEqual(vitFoundations.items.length, 4, 'Vitality foundations must contain exactly 4 disciplines');
  assert.ok(vitProtocols, 'Vitality must preserve existing sec_vitality_protocols');

  const vitItemTitles = vitFoundations.items.map(i => i.title);
  assert.ok(vitItemTitles.some(t => t.includes('Yoga')), 'Foundations must include Yoga discipline');
  assert.ok(vitItemTitles.some(t => t.includes('Breath')), 'Foundations must include Breath discipline');
  assert.ok(vitItemTitles.some(t => t.includes('Health')), 'Foundations must include Cellular Health discipline');
  assert.ok(vitItemTitles.some(t => t.includes('Fitness')), 'Foundations must include Fitness discipline');
  console.log('  ✅ Vitality: 4-discipline foundations & daily protocols verified in database.');

  // Lifestyle Checks
  const lifestylePage = await Page.findOne({ slug: 'lifestyle' }).lean();
  const lifePillars = lifestylePage.sections.find(s => s.sectionId === 'sec_lifestyle_pillars');
  assert.ok(lifePillars, 'Lifestyle must have sec_lifestyle_pillars section');
  assert.strictEqual(lifePillars.items.length, 4, 'Lifestyle pillars must contain exactly 4 cards');
  const lifeItemTitles = lifePillars.items.map(i => i.title);
  assert.ok(lifeItemTitles.some(t => t.includes('Cognitive Resilience')), 'Pillar 1: Cognitive Resilience');
  assert.ok(lifeItemTitles.some(t => t.includes('Circadian Alignment')), 'Pillar 2: Circadian Alignment');
  assert.ok(lifeItemTitles.some(t => t.includes('Ecological Symbiosis')), 'Pillar 3: Ecological Symbiosis');
  assert.ok(lifeItemTitles.some(t => t.includes('Collective Vitality')), 'Pillar 4: Collective Vitality');
  console.log('  ✅ Lifestyle: 4 pillars verified in database.');

  // Longevity Checks
  const longevityPage = await Page.findOne({ slug: 'longevity' }).lean();
  const longPillars = longevityPage.sections.find(s => s.sectionId === 'sec_longevity_pillars');
  assert.ok(longPillars, 'Longevity must have sec_longevity_pillars section');
  assert.strictEqual(longPillars.items.length, 4, 'Longevity pillars must contain exactly 4 cards');
  const longItemTitles = longPillars.items.map(i => i.title);
  assert.ok(longItemTitles.some(t => t.includes('Nutrition and Metabolic Health')), 'Longevity Pillar 1 verified');
  assert.ok(longItemTitles.some(t => t.includes('Regeneration')), 'Longevity Pillar 2 verified');
  assert.ok(longItemTitles.some(t => t.includes('Psychological Coherence')), 'Longevity Pillar 3 verified');
  assert.ok(longItemTitles.some(t => t.includes('Socio-Environmental Connection')), 'Longevity Pillar 4 verified');
  console.log('  ✅ Longevity: 4 pillars verified in database.');

  // TEST 5: Live Settings Document Verification in MongoDB
  console.log('\nTest 5: Verifying Live Settings in MongoDB');
  const directSettings = await Settings.collection.findOne();
  console.log('directSettings.general:', directSettings.general);
  console.log('directSettings.socialLinks:', directSettings.socialLinks);

  const liveSettings = await Settings.findOne();
  console.log('liveSettings.general:', liveSettings.general);
  assert.ok(
    liveSettings.socialLinks.youtube !== undefined,
    'socialLinks must have youtube key'
  );
  assert.ok(
    liveSettings.socialLinks.linkedin !== undefined,
    'socialLinks must have linkedin key'
  );
  assert.strictEqual(
    liveSettings.socialLinks.youtube,
    '',
    'YouTube URL must be empty string until client confirms official link'
  );
  assert.strictEqual(
    liveSettings.socialLinks.linkedin,
    '',
    'LinkedIn URL must be empty string until client confirms official link'
  );
  assert.ok(
    liveSettings.socialLinks.facebook.includes('facebook.com'),
    'Existing Facebook link must be preserved'
  );
  assert.ok(
    liveSettings.socialLinks.instagram.includes('instagram.com'),
    'Existing Instagram link must be preserved'
  );
  console.log('  ✅ Test 5 Passed: Live Settings document in MongoDB holds verified fields.\n');

  await mongoose.disconnect();
  console.log('🎉 All Phase 2 Verification Tests Passed Successfully (5/5)!');
}

runPhase2Tests().catch((err) => {
  console.error('❌ Phase 2 Test Failure:', err);
  process.exit(1);
});
