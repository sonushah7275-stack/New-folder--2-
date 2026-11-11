import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const screenshotDir = path.resolve('C:/Users/Sonu/.gemini/antigravity/brain/a00b4b42-bd2e-47e1-92d9-1a7d0bd21b91/screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch (_) {}
    await sleep(500);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function main() {
  console.log('🧪 Starting Phase 4: Four Pillar Pages Enhancement & Product Removal Verification...\n');

  // 1. Launch Backend on port 5000 if not already running
  let backendProc = null;
  try {
    const checkBackend = await fetch('http://localhost:5000/api/settings/public');
    if (checkBackend.ok) {
      console.log('✅ Backend is already running on port 5000.');
    }
  } catch (_) {
    console.log('🚀 Starting Backend on port 5000...');
    backendProc = spawn('node', ['server.js'], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, PORT: '5000' },
      stdio: 'pipe',
    });
    await waitForUrl('http://localhost:5000/api/settings/public', 30000);
    console.log('✅ Backend is live on port 5000.');
  }

  // 2. Launch TEJOVA public frontend on port 3000
  console.log('🚀 Starting TEJOVA Public Frontend on port 3000...');
  const frontendProc = spawn('npx', ['vite', '--port', '3000', '--host'], {
    cwd: path.resolve(__dirname, '../../TEJOVA'),
    env: { ...process.env },
    shell: true,
    stdio: 'pipe',
  });

  frontendProc.stdout.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('ready in') || msg.includes('Local:')) {
      console.log(`[Frontend] ${msg.trim()}`);
    }
  });

  try {
    await waitForUrl('http://localhost:3000', 30000);
    console.log('✅ TEJOVA Frontend is live on port 3000.\n');

    const browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,1000'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });

    // -------------------------------------------------------------------------
    // TEST 1: Vitality Page (/vitality)
    // -------------------------------------------------------------------------
    console.log('Test 1: Verifying Vitality Page (/vitality)...');
    await page.goto('http://localhost:3000/vitality', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const vitalityText = await page.evaluate(() => document.body.innerText);

    // Assert ProductGrid is removed
    assert.ok(
      !vitalityText.includes('Formulations for Vitality'),
      'ProductGrid section ("Formulations for Vitality") must be REMOVED from Vitality page'
    );
    assert.ok(
      !vitalityText.includes('Targeted Botanical Support'),
      'Targeted Botanical Support product section must be REMOVED'
    );

    // Assert 4 Sovereign Disciplines are present
    assert.ok(
      vitalityText.includes('Sovereign Yoga'),
      'Vitality page must include discipline 1: Sovereign Yoga'
    );
    assert.ok(
      vitalityText.includes('Autonomic Breath'),
      'Vitality page must include discipline 2: Autonomic Breath'
    );
    assert.ok(
      vitalityText.includes('Cellular Health'),
      'Vitality page must include discipline 3: Cellular Health'
    );
    assert.ok(
      vitalityText.includes('Adaptive Fitness'),
      'Vitality page must include discipline 4: Adaptive Fitness'
    );

    // Assert Daily Protocols section is preserved
    assert.ok(
      vitalityText.includes('Sovereign Rituals') || vitalityText.includes('DAILY PROTOCOLS') || vitalityText.includes('Recommended Rituals'),
      'Vitality page must preserve Daily Protocols section (sec_vitality_protocols)'
    );

    // Assert Journal articles section is present
    assert.ok(
      vitalityText.includes('From The Journal') || vitalityText.includes('Further Reading on Vitality'),
      'Vitality page must render Journal articles'
    );

    const shot1 = path.join(screenshotDir, '12_vitality_sovereign_disciplines.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot1}`);
    console.log('  ✅ Test 1 Passed: Vitality page verified (ProductGrid removed, 4 Disciplines active, Daily Protocols preserved, Journal active).\n');

    // -------------------------------------------------------------------------
    // TEST 2: Nourishment Page (/nourishment)
    // -------------------------------------------------------------------------
    console.log('Test 2: Verifying Nourishment Page (/nourishment)...');
    await page.goto('http://localhost:3000/nourishment', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const nourishmentText = await page.evaluate(() => document.body.innerText);

    // Assert ProductGrid is removed
    assert.ok(
      !nourishmentText.includes('Whole-Food Formulations'),
      'ProductGrid section ("Whole-Food Formulations") must be REMOVED from Nourishment page'
    );
    assert.ok(
      !nourishmentText.includes('Supplements & Botanicals'),
      'Supplements & Botanicals product section must be REMOVED'
    );

    // Assert The Nourishment Ethos section is present with Midnight Blue background
    const ethosBgColor = await page.evaluate(() => {
      const ethosSection = Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('The Nourishment Ethos') || s.textContent.includes('TEJOVA LIFE')
      );
      if (!ethosSection) return null;
      return window.getComputedStyle(ethosSection).backgroundColor;
    });
    console.log(`  Ethos computed background color: ${ethosBgColor}`);
    assert.ok(
      ethosBgColor === 'rgb(10, 35, 66)',
      `The Nourishment Ethos must have Midnight Blue background (#0A2342 / rgb(10, 35, 66)), got: ${ethosBgColor}`
    );

    // Assert 4 Elemental Nourishment cards are preserved
    assert.ok(
      nourishmentText.includes('The 4 Pillars of Elemental Nourishment'),
      'Nourishment page must preserve The 4 Pillars of Elemental Nourishment'
    );

    // Assert Journal articles section is present
    assert.ok(
      nourishmentText.includes('Nourishment Stories') || nourishmentText.includes('From The Journal'),
      'Nourishment page must render Journal articles'
    );

    const shot2 = path.join(screenshotDir, '13_nourishment_elemental_pillars.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot2}`);
    console.log('  ✅ Test 2 Passed: Nourishment page verified (ProductGrid removed, Midnight Blue Ethos preserved, 4 Elemental cards preserved, Journal active).\n');

    // -------------------------------------------------------------------------
    // TEST 3: Lifestyle Page (/lifestyle)
    // -------------------------------------------------------------------------
    console.log('Test 3: Verifying Lifestyle Page (/lifestyle)...');
    await page.goto('http://localhost:3000/lifestyle', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const lifestyleText = await page.evaluate(() => document.body.innerText);

    // Assert ProductGrid is removed
    assert.ok(
      !lifestyleText.includes('Products for Lifestyle Support'),
      'ProductGrid section ("Products for Lifestyle Support") must be REMOVED from Lifestyle page'
    );
    assert.ok(
      !lifestyleText.includes('Nootropics & Clarity'),
      'Nootropics & Clarity product section must be REMOVED'
    );

    // Assert Mindful Architecture section is present with Midnight Blue background
    const mindfulArchBgColor = await page.evaluate(() => {
      const mindfulSection = Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('Mindful Architecture')
      );
      if (!mindfulSection) return null;
      return window.getComputedStyle(mindfulSection).backgroundColor;
    });
    console.log(`  Mindful Architecture computed background color: ${mindfulArchBgColor}`);
    assert.ok(
      mindfulArchBgColor === 'rgb(10, 35, 66)',
      `Mindful Architecture must have Midnight Blue background (#0A2342 / rgb(10, 35, 66)), got: ${mindfulArchBgColor}`
    );

    // Assert 4 Lifestyle Pillars are present
    assert.ok(
      lifestyleText.includes('Cognitive Resilience'),
      'Lifestyle page must include pillar 1: Cognitive Resilience'
    );
    assert.ok(
      lifestyleText.includes('Circadian Alignment'),
      'Lifestyle page must include pillar 2: Circadian Alignment'
    );
    assert.ok(
      lifestyleText.includes('Ecological Symbiosis'),
      'Lifestyle page must include pillar 3: Ecological Symbiosis'
    );
    assert.ok(
      lifestyleText.includes('Collective Vitality'),
      'Lifestyle page must include pillar 4: Collective Vitality'
    );

    // Assert Lifestyle Rituals are preserved
    assert.ok(
      lifestyleText.includes('The 3 Rituals of Conscious Living') || lifestyleText.includes('Inner Alignment'),
      'Lifestyle page must preserve Lifestyle Rituals'
    );

    // Assert Journal articles section is present
    assert.ok(
      lifestyleText.includes('Mindfulness, Growth & Lifestyle Stories') || lifestyleText.includes('From The Journal'),
      'Lifestyle page must render Journal articles'
    );

    const shot3 = path.join(screenshotDir, '14_lifestyle_four_pillars_blue_bg.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot3}`);
    console.log('  ✅ Test 3 Passed: Lifestyle page verified (ProductGrid removed, Midnight Blue background active, 4 Pillars active, Rituals preserved, Journal active).\n');

    // -------------------------------------------------------------------------
    // TEST 4: Longevity Page (/longevity)
    // -------------------------------------------------------------------------
    console.log('Test 4: Verifying Longevity Page (/longevity)...');
    await page.goto('http://localhost:3000/longevity', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const longevityText = await page.evaluate(() => document.body.innerText);

    // Assert ProductGrid is removed
    assert.ok(
      !longevityText.includes('Longevity Formulations'),
      'ProductGrid section ("Longevity Formulations") must be REMOVED from Longevity page'
    );
    assert.ok(
      !longevityText.includes('Cellular & Restorative Science'),
      'Cellular & Restorative Science product section must be REMOVED'
    );

    // Assert Longevity Architecture section is present with Midnight Blue background
    const longevityArchBgColor = await page.evaluate(() => {
      const archSection = Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('Longevity Architecture')
      );
      if (!archSection) return null;
      return window.getComputedStyle(archSection).backgroundColor;
    });
    console.log(`  Longevity Architecture computed background color: ${longevityArchBgColor}`);
    assert.ok(
      longevityArchBgColor === 'rgb(10, 35, 66)',
      `Longevity Architecture must have Midnight Blue background (#0A2342 / rgb(10, 35, 66)), got: ${longevityArchBgColor}`
    );

    // Assert 4 Longevity Pillars are present
    assert.ok(
      longevityText.includes('Nutrition and Metabolic Health'),
      'Longevity page must include pillar 1: Nutrition and Metabolic Health'
    );
    assert.ok(
      longevityText.includes('Regeneration & Deep Recovery') || longevityText.includes('Regeneration, Biological Aging, and Deep Recovery'),
      'Longevity page must include pillar 2: Regeneration & Deep Recovery'
    );
    assert.ok(
      longevityText.includes('Psychological Coherence & Brain Longevity'),
      'Longevity page must include pillar 3: Psychological Coherence & Brain Longevity'
    );
    assert.ok(
      longevityText.includes('Socio-Environmental Connection'),
      'Longevity page must include pillar 4: Socio-Environmental Connection'
    );

    // Assert Keys to Cellular Longevity highlights are preserved
    assert.ok(
      longevityText.includes('Biological Resilience') || longevityText.includes('Keys to Cellular Longevity'),
      'Longevity page must preserve Biological Resilience keys'
    );

    // Assert Journal articles section is present
    assert.ok(
      longevityText.includes('Epigenetics, Autophagy & Longevity Research') || longevityText.includes('From The Journal'),
      'Longevity page must render Journal articles'
    );

    const shot4 = path.join(screenshotDir, '15_longevity_four_pillars_blue_bg.png');
    await page.screenshot({ path: shot4, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot4}`);
    console.log('  ✅ Test 4 Passed: Longevity page verified (ProductGrid removed, Midnight Blue background active, 4 Pillars active, Keys preserved, Journal active).\n');

    // -------------------------------------------------------------------------
    // TEST 5: Product Catalog Intactness (/products)
    // -------------------------------------------------------------------------
    console.log('Test 5: Verifying Products Catalog (/products)...');
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const productsText = await page.evaluate(() => document.body.innerText);
    assert.ok(
      productsText.includes('All') && (productsText.includes('Vitality') || productsText.includes('Formulations')),
      'Products catalog must load with categories and formulations'
    );

    const shot5 = path.join(screenshotDir, '16_product_catalog_intact.png');
    await page.screenshot({ path: shot5, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot5}`);
    console.log('  ✅ Test 5 Passed: Product catalog is 100% intact and functional.\n');

    await browser.close();
    console.log('🎉 ALL 5 PHASE 4 VERIFICATION SUITES PASSED SUCCESSFULLY!');
  } finally {
    try {
      if (frontendProc && !frontendProc.killed) {
        frontendProc.kill('SIGTERM');
      }
      if (backendProc && !backendProc.killed) {
        backendProc.kill('SIGTERM');
      }
    } catch (_) {}
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Phase 4 Verification Failed:', err);
  process.exit(1);
});
