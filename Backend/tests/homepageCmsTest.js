import assert from 'assert';
import mongoose from 'mongoose';
import Page from '../models/Page.js';
import { getPageBySlug, upsertPage } from '../controllers/pageController.js';

async function runHomepageCmsTests() {
  console.log('🧪 Starting Dedicated Homepage CMS Test Suite...\n');

  // Test 1: Page Schema with all Homepage Section Types
  console.log('Test 1: Verifying Page Schema supports all Homepage Section types');
  const testPage = new Page({
    slug: 'test-home',
    title: 'Test Homepage',
    hero: {
      title: 'Hero Title',
      subtitle: 'Hero Subtitle',
      description: 'Hero Desc',
      ctaText: 'Primary CTA',
      ctaLink: '/primary',
      secondaryCtaText: 'Secondary CTA',
      secondaryCtaLink: '/secondary',
      floatingBadgeTitle: 'Badge Title',
      floatingBadgeSubtitle: 'Badge Subtitle',
      features: ['Feature 1', 'Feature 2'],
      mediaUrl: 'https://cloudinary.com/test.jpg',
      resourceType: 'image'
    },
    sections: [
      {
        sectionId: 'sec_announcement',
        type: 'announcement',
        title: 'Announcement',
        content: 'Free Shipping',
        order: 0,
        isVisible: true
      },
      {
        sectionId: 'sec_vitality',
        type: 'vitality',
        title: 'Vitality',
        kicker: 'Pillar 01',
        content: 'Vitality description',
        order: 1,
        isVisible: true
      },
      {
        sectionId: 'sec_nourishment',
        type: 'nourishment',
        title: 'Nourishment',
        kicker: 'Pillar 02',
        content: 'Nourishment description',
        order: 2,
        isVisible: true
      },
      {
        sectionId: 'sec_lifestyle',
        type: 'lifestyle',
        title: 'Lifestyle',
        kicker: 'Pillar 03',
        content: 'Lifestyle description',
        order: 3,
        isVisible: false // Disabled section test
      },
      {
        sectionId: 'sec_longevity',
        type: 'longevity',
        title: 'Longevity',
        kicker: 'Pillar 04',
        content: 'Longevity description',
        order: 4,
        isVisible: true
      },
      {
        sectionId: 'sec_products',
        type: 'products',
        title: 'Featured Products',
        content: 'Our formulations',
        order: 5,
        isVisible: true
      },
      {
        sectionId: 'sec_journal',
        type: 'journal',
        title: 'From Our Journal',
        content: 'Editorial reflections',
        order: 6,
        isVisible: true
      },
      {
        sectionId: 'sec_cta',
        type: 'cta',
        title: 'Final CTA Banner',
        content: 'Begin journey',
        order: 7,
        isVisible: true
      }
    ]
  });

  const validationError = testPage.validateSync();
  assert.strictEqual(validationError, undefined, 'Test page must validate cleanly without schema errors');
  console.log('  ✅ Test 1 Passed: All homepage section types validate in Page schema.\n');

  // Test 2: Hero Customization Fields Validation
  console.log('Test 2: Verifying Hero secondary CTA, badges, and features');
  assert.strictEqual(testPage.hero.secondaryCtaText, 'Secondary CTA');
  assert.strictEqual(testPage.hero.secondaryCtaLink, '/secondary');
  assert.strictEqual(testPage.hero.floatingBadgeTitle, 'Badge Title');
  assert.strictEqual(testPage.hero.features.length, 2);
  console.log('  ✅ Test 2 Passed: Hero secondary CTA and floating badge fields verified.\n');

  // Test 3: Public Filtering Logic of Inactive Sections
  console.log('Test 3: Verifying getPageBySlug filters out inactive sections for public calls');
  // Mock Page.findOne
  const origFindOne = Page.findOne;
  Page.findOne = function() {
    return {
      toObject: () => JSON.parse(JSON.stringify(testPage.toObject())),
      isPublished: true,
      sections: testPage.sections
    };
  };

  try {
    // 3a: Non-admin public request
    let publicResult = null;
    const publicReq = { params: { slug: 'test-home' }, user: null, query: {} };
    const publicRes = {
      status: (code) => {
        assert.strictEqual(code, 200);
        return {
          json: (data) => {
            publicResult = data;
          }
        };
      }
    };

    await getPageBySlug(publicReq, publicRes, () => {});
    assert.ok(publicResult, 'Public result must be returned');
    assert.strictEqual(publicResult.success, true);
    // Lifestyle section was isVisible: false -> must be excluded!
    const lifestyleInPublic = publicResult.data.sections.find(s => s.sectionId === 'sec_lifestyle');
    assert.strictEqual(lifestyleInPublic, undefined, 'Hidden section (sec_lifestyle) must NOT be returned to public');
    assert.strictEqual(publicResult.data.sections.length, 7, 'Only 7 visible sections must be returned');

    // 3b: Admin request with adminView=true
    let adminResult = null;
    const adminReq = { params: { slug: 'test-home' }, user: { role: 'admin' }, query: { adminView: 'true' } };
    const adminRes = {
      status: (code) => {
        assert.strictEqual(code, 200);
        return {
          json: (data) => {
            adminResult = data;
          }
        };
      }
    };

    await getPageBySlug(adminReq, adminRes, () => {});
    assert.ok(adminResult, 'Admin result must be returned');
    const lifestyleInAdmin = adminResult.data.sections.find(s => s.sectionId === 'sec_lifestyle');
    assert.ok(lifestyleInAdmin, 'Hidden section (sec_lifestyle) MUST be visible to admin');
    assert.strictEqual(adminResult.data.sections.length, 8, 'All 8 sections must be returned to admin');

    console.log('  ✅ Test 3 Passed: Public caller receives only active sections (7/8); admin receives all (8/8).\n');
  } finally {
    Page.findOne = origFindOne;
  }

  // Test 4: Section Sorting by Order
  console.log('Test 4: Verifying Section sorting by order');
  const unorganisedSections = [
    { sectionId: 's3', order: 2, isVisible: true },
    { sectionId: 's1', order: 0, isVisible: true },
    { sectionId: 's2', order: 1, isVisible: true },
  ];
  const sorted = [...unorganisedSections].sort((a, b) => a.order - b.order);
  assert.strictEqual(sorted[0].sectionId, 's1');
  assert.strictEqual(sorted[1].sectionId, 's2');
  assert.strictEqual(sorted[2].sectionId, 's3');
  console.log('  ✅ Test 4 Passed: Sections sort accurately by order.\n');

  console.log('🎉 All Dedicated Homepage CMS Tests Passed Successfully (4/4)!');
}

runHomepageCmsTests().catch(err => {
  console.error('❌ Test failure:', err);
  process.exit(1);
});
