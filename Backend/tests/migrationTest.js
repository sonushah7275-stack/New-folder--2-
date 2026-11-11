import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import Page from '../models/Page.js';
import CmsMigrationService from '../services/CmsMigrationService.js';
import { getPublicSettings } from '../controllers/settingsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('🧪 Starting Phase 1 Verification Tests...\n');

  // TEST 1: Settings Schema Defaults Verification
  console.log('Test 1: Verifying Settings Schema Defaults & Constraints');
  const dummySettings = new Settings({});
  assert.strictEqual(
    dummySettings.general.address,
    'C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India',
    'Default address must match official Nagpur address.'
  );
  assert.strictEqual(
    dummySettings.general.supportEmail,
    'concierge@tejova.com',
    'Default support email must be concierge@tejova.com.'
  );
  assert.strictEqual(
    dummySettings.general.careEmail,
    'care@tejova.com',
    'Default care email must be care@tejova.com.'
  );
  assert.strictEqual(
    dummySettings.socialLinks.youtube,
    '',
    'YouTube link must default to empty string (Condition 1: no assumed URLs).'
  );
  assert.strictEqual(
    dummySettings.socialLinks.linkedin,
    '',
    'LinkedIn link must default to empty string (Condition 1: no assumed URLs).'
  );
  console.log('  ✅ Test 1 Passed: Settings schema defaults verified with zero assumed social URLs.\n');

  // TEST 2: Manifest Completeness & Stability of Section IDs
  console.log('Test 2: Verifying CMS Migration Manifest Completeness');
  const service = new CmsMigrationService();
  const manifest = service.getMigrationPagesManifest();
  const expectedSlugs = [
    'privacy-policy',
    'terms-and-conditions',
    'shipping-policy',
    'faqs',
    'vitality',
    'lifestyle',
    'longevity',
    'about',
    'contact',
    'home',
    'products'
  ];
  const manifestSlugs = manifest.map(p => p.slug);
  for (const slug of expectedSlugs) {
    assert.ok(manifestSlugs.includes(slug), `Manifest must include page: ${slug}`);
  }

  // Check Privacy Policy clauses
  const privacy = manifest.find(p => p.slug === 'privacy-policy');
  assert.ok(privacy.sections.some(s => s.sectionId === 'sec_privacy_policy_content'));
  assert.ok(privacy.sections[0].content.includes('Biological Sovereignty'));
  assert.ok(privacy.sections[0].content.includes('DPDPA, India'));
  assert.ok(privacy.sections[0].content.includes('GDPR'));
  assert.ok(privacy.sections[0].content.includes('CCPA'));

  // Check Terms and Conditions
  const terms = manifest.find(p => p.slug === 'terms-and-conditions');
  assert.ok(terms.sections.some(s => s.sectionId === 'sec_terms_conditions_content'));
  assert.ok(terms.sections[0].content.includes('Archana C Parate'));
  assert.ok(terms.sections[0].content.includes('Nagpur, Maharashtra, India'));

  // Check Shipping Policy
  const shipping = manifest.find(p => p.slug === 'shipping-policy');
  assert.ok(shipping.sections.some(s => s.sectionId === 'sec_shipping_policy_content'));
  assert.ok(shipping.sections[0].content.includes('21 Daily Habits for Lifelong Health'));

  // Check FAQs (all 8 items)
  const faqs = manifest.find(p => p.slug === 'faqs');
  assert.strictEqual(faqs.sections[0].items.length, 8, 'FAQ section must contain exactly 8 items.');

  // Check Vitality 4 disciplines
  const vitality = manifest.find(p => p.slug === 'vitality');
  const vitSec = vitality.sections.find(s => s.sectionId === 'sec_vitality_foundations');
  assert.ok(vitSec, 'Vitality must include sec_vitality_foundations');
  assert.strictEqual(vitSec.items.length, 4, 'Vitality foundations must contain 4 disciplines');

  // Check Lifestyle 4 pillars
  const lifestyle = manifest.find(p => p.slug === 'lifestyle');
  const lifeSec = lifestyle.sections.find(s => s.sectionId === 'sec_lifestyle_pillars');
  assert.ok(lifeSec, 'Lifestyle must include sec_lifestyle_pillars');
  assert.strictEqual(lifeSec.items.length, 4, 'Lifestyle pillars must contain 4 cards');

  // Check Longevity 4 pillars
  const longevity = manifest.find(p => p.slug === 'longevity');
  const longSec = longevity.sections.find(s => s.sectionId === 'sec_longevity_pillars');
  assert.ok(longSec, 'Longevity must include sec_longevity_pillars');
  assert.strictEqual(longSec.items.length, 4, 'Longevity pillars must contain 4 cards');
  console.log('  ✅ Test 2 Passed: CMS Manifest covers all pages, legal clauses, FAQs, and 4-pillar cards.\n');

  // TEST 3: Pre-Migration Backup Functionality (Condition 3)
  console.log('Test 3: Verifying Pre-Migration Backup Engine');
  const backupTestDir = path.resolve(__dirname, 'test_backups');
  service.backupDir = backupTestDir;

  // Mock Settings.find and Page.find for isolated testing
  const origSettingsFind = Settings.find;
  const origPageFind = Page.find;

  Settings.find = () => ({
    lean: async () => [{ _id: 'set1', general: { siteName: 'TEJOVA' } }]
  });
  Page.find = () => ({
    lean: async () => [
      { _id: 'p1', slug: 'vitality', sections: [{ sectionId: 'sec_vitality_protocols' }] }
    ]
  });

  const backupReport = await service.backupData();
  assert.ok(fs.existsSync(backupReport.settingsBackupFile), 'Settings backup file must exist.');
  assert.ok(fs.existsSync(backupReport.pagesBackupFile), 'Pages backup file must exist.');

  const backedUpSettings = JSON.parse(fs.readFileSync(backupReport.settingsBackupFile, 'utf8'));
  const backedUpPages = JSON.parse(fs.readFileSync(backupReport.pagesBackupFile, 'utf8'));
  assert.strictEqual(backedUpSettings.length, 1);
  assert.strictEqual(backedUpPages.length, 1);
  console.log('  ✅ Test 3 Passed: Data backup created and serialized accurately before mutations.\n');

  // TEST 4: Settings Migration & Preservation of Customizations (Condition 1 & 3)
  console.log('Test 4: Verifying Settings Migration Safety & Idempotence');
  // Scenario A: Existing customized settings should NOT be overwritten
  let savedSettingsDoc = null;
  const mockCustomSettings = {
    general: {
      siteName: 'My Custom Brand',
      address: 'Custom Address, Mumbai',
      supportEmail: 'custom@domain.com',
      careEmail: 'care@domain.com',
    },
    socialLinks: {
      facebook: 'https://facebook.com/custom',
      instagram: 'https://instagram.com/custom',
      twitter: '',
      pinterest: '',
      // youtube & linkedin missing
    },
    save: async function() {
      savedSettingsDoc = this;
      return this;
    }
  };

  Settings.findOne = async () => mockCustomSettings;
  const settingsReport = await service.migrateSettings();

  assert.strictEqual(mockCustomSettings.general.siteName, 'My Custom Brand', 'Custom siteName must be preserved.');
  assert.strictEqual(mockCustomSettings.general.address, 'Custom Address, Mumbai', 'Custom address must be preserved.');
  assert.strictEqual(mockCustomSettings.general.supportEmail, 'custom@domain.com', 'Custom support email must be preserved.');
  assert.strictEqual(mockCustomSettings.socialLinks.facebook, 'https://facebook.com/custom', 'Existing Facebook URL must be preserved.');
  assert.strictEqual(mockCustomSettings.socialLinks.youtube, '', 'Missing YouTube must be initialized to empty string (no assumed URL).');
  assert.strictEqual(mockCustomSettings.socialLinks.linkedin, '', 'Missing LinkedIn must be initialized to empty string (no assumed URL).');
  console.log('  ✅ Test 4 Passed: Custom settings preserved; YouTube & LinkedIn added safely.\n');

  // TEST 5: Idempotent CMS Section Migration & Ritual Preservation (Condition 2)
  console.log('Test 5: Verifying Non-Destructive Section Migration & Ritual Preservation');
  // Mock an existing 'vitality' page that already has custom rituals
  const existingVitalityPage = {
    slug: 'vitality',
    title: 'Custom Vitality Page',
    sections: [
      {
        sectionId: 'sec_vitality_protocols',
        title: 'Original Daily Protocols',
        items: [{ id: 'item_1', title: 'Original Asana Ritual' }]
      }
    ],
    markModified: () => {},
    save: async function() {
      return this;
    }
  };

  let createdPages = [];
  Page.create = async (pageData) => {
    const pageInstance = {
      ...pageData,
      markModified: () => {},
      save: async function() { return this; }
    };
    createdPages.push(pageInstance);
    return pageInstance;
  };

  Page.findOne = async ({ slug }) => {
    if (slug === 'vitality') return existingVitalityPage;
    return createdPages.find(p => p.slug === slug) || null;
  };

  const cmsReport1 = await service.migrateCmsPages();
  // 1. Existing vitality page should now have both sections:
  const vitalitySecIds = existingVitalityPage.sections.map(s => s.sectionId);
  assert.ok(vitalitySecIds.includes('sec_vitality_protocols'), 'Existing rituals section must be preserved!');
  assert.ok(vitalitySecIds.includes('sec_vitality_foundations'), 'New 4-discipline foundations section must be appended.');
  assert.strictEqual(existingVitalityPage.sections[0].title, 'Original Daily Protocols', 'Original content must not be overwritten.');

  // 2. Run migration a SECOND time to verify idempotence:
  const cmsReport2 = await service.migrateCmsPages();
  assert.strictEqual(cmsReport2.sectionsAdded.length, 0, 'Second run must add 0 duplicate sections.');
  assert.strictEqual(existingVitalityPage.sections.length, 2, 'Total sections must remain exactly 2.');
  console.log('  ✅ Test 5 Passed: Existing rituals preserved; sections appended idempotently without duplication.\n');

  // TEST 6: Public Settings Controller API Verification
  console.log('Test 6: Verifying Public Settings API Controller Output');
  Settings.findOne = async () => ({
    general: {
      siteName: 'TEJOVA VERIFIED',
      tagline: 'Sovereign Wellness',
      supportEmail: 'concierge@tejova.com',
      careEmail: 'care@tejova.com',
      contactPhone: '+91 98765 43210',
      address: 'C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India'
    },
    socialLinks: {
      facebook: 'https://facebook.com/tejova',
      instagram: 'https://instagram.com/tejova',
      twitter: '',
      pinterest: '',
      youtube: '',
      linkedin: ''
    },
    businessHours: { mondayToFriday: '9:00 AM - 6:00 PM' },
    maintenanceMode: false
  });

  let responseData = null;
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        responseData = data;
        return data;
      }
    })
  };

  await getPublicSettings({}, mockRes, (err) => { throw err; });
  assert.strictEqual(responseData.success, true);
  assert.strictEqual(responseData.data.siteName, 'TEJOVA VERIFIED');
  assert.strictEqual(responseData.data.address, 'C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India');
  assert.strictEqual(responseData.data.careEmail, 'care@tejova.com');
  assert.strictEqual(responseData.data.supportEmail, 'concierge@tejova.com');
  assert.ok('youtube' in responseData.data.socialLinks, 'Public response must contain youtube key');
  assert.ok('linkedin' in responseData.data.socialLinks, 'Public response must contain linkedin key');
  console.log('  ✅ Test 6 Passed: Public settings API returns all required client fields and social links.\n');

  // Clean up test backup directory
  if (fs.existsSync(backupTestDir)) {
    fs.rmSync(backupTestDir, { recursive: true, force: true });
  }

  // Restore original functions
  Settings.find = origSettingsFind;
  Page.find = origPageFind;

  console.log('🎉 All Phase 1 Verification Tests Passed Successfully (6/6)!');
}

runTests().catch((err) => {
  console.error('❌ Phase 1 Test Failure:', err);
  process.exit(1);
});
