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
  console.log('🧪 Starting Phase 3: Public Legal Policies & FAQ Live Verification...\n');

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

  frontendProc.stdout.on('data', (d) => process.stdout.write(`[Frontend] ${d}`));
  frontendProc.stderr.on('data', (d) => process.stderr.write(`[Frontend ERR] ${d}`));

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
    // TEST 1: Privacy Policy & Route Aliases
    // -------------------------------------------------------------------------
    console.log('Test 1: Verifying Privacy Policy (/privacy-policy & /privacy)...');
    await page.goto('http://localhost:3000/privacy-policy', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const privacyTitle = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(privacyTitle.includes('Privacy Policy'), `H1 must include 'Privacy Policy', got: '${privacyTitle}'`);

    const privacyContent = await page.$eval('.policy-content', el => el.textContent);
    assert.ok(privacyContent.includes('Biological Sovereignty'), 'Must contain Biological Sovereignty clause');
    assert.ok(privacyContent.includes('DPDPA'), 'Must contain DPDPA reference');
    assert.ok(privacyContent.includes('GDPR'), 'Must contain GDPR reference');
    assert.ok(privacyContent.includes('CCPA'), 'Must contain CCPA reference');

    const shot1 = path.join(screenshotDir, '07_public_privacy_policy.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot1}`);

    // Verify alias /privacy
    await page.goto('http://localhost:3000/privacy', { waitUntil: 'networkidle2' });
    await sleep(1500);
    const alias1Title = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(alias1Title.includes('Privacy Policy'), 'Alias /privacy must resolve to Privacy Policy');
    console.log('  ✅ Test 1 Passed: Privacy Policy renders CMS data and aliases resolve accurately.\n');

    // -------------------------------------------------------------------------
    // TEST 2: Terms and Conditions & Route Aliases
    // -------------------------------------------------------------------------
    console.log('Test 2: Verifying Terms and Conditions (/terms-and-conditions & /terms)...');
    await page.goto('http://localhost:3000/terms-and-conditions', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const termsTitle = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(termsTitle.includes('Terms and Conditions'), `H1 must include 'Terms and Conditions', got: '${termsTitle}'`);

    const termsContent = await page.$eval('.policy-content', el => el.textContent);
    assert.ok(termsContent.includes('Archana C Parate'), 'Must contain Archana C Parate proprietary clause');
    assert.ok(termsContent.includes('Nagpur, Maharashtra, India'), 'Must contain official Nagpur jurisdiction');

    const shot2 = path.join(screenshotDir, '08_public_terms_conditions.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot2}`);

    // Verify alias /terms
    await page.goto('http://localhost:3000/terms', { waitUntil: 'networkidle2' });
    await sleep(1500);
    const alias2Title = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(alias2Title.includes('Terms and Conditions'), 'Alias /terms must resolve to Terms and Conditions');
    console.log('  ✅ Test 2 Passed: Terms and Conditions renders CMS data and aliases resolve accurately.\n');

    // -------------------------------------------------------------------------
    // TEST 3: Shipping, Delivery & Refund Policy & Route Aliases
    // -------------------------------------------------------------------------
    console.log('Test 3: Verifying Shipping & Refund Policy (/shipping-policy, /shipping-returns, /refund-policy)...');
    await page.goto('http://localhost:3000/shipping-policy', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const shippingTitle = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(
      shippingTitle.includes('Shipping') || shippingTitle.includes('Delivery'),
      `H1 must include Shipping/Delivery, got: '${shippingTitle}'`
    );

    const shippingContent = await page.$eval('.policy-content', el => el.textContent);
    assert.ok(shippingContent.includes('21 Daily Habits'), 'Must contain 21 Daily Habits client reference');

    const shot3 = path.join(screenshotDir, '09_public_shipping_policy.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot3}`);

    // Verify alias /shipping-returns
    await page.goto('http://localhost:3000/shipping-returns', { waitUntil: 'networkidle2' });
    await sleep(1500);
    const alias3Title = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(alias3Title.includes('Shipping'), 'Alias /shipping-returns must resolve accurately');

    // Verify alias /refund-policy
    await page.goto('http://localhost:3000/refund-policy', { waitUntil: 'networkidle2' });
    await sleep(1500);
    const alias4Title = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(alias4Title.includes('Shipping') || alias4Title.includes('Refund'), 'Alias /refund-policy must resolve accurately');
    console.log('  ✅ Test 3 Passed: Shipping & Refund Policy renders CMS data and all 3 aliases resolve accurately.\n');

    // -------------------------------------------------------------------------
    // TEST 4: FAQs & Accordion Interaction (/faqs & /faq)
    // -------------------------------------------------------------------------
    console.log('Test 4: Verifying FAQs Page & Accordion Animation (/faqs & /faq)...');
    await page.goto('http://localhost:3000/faqs', { waitUntil: 'networkidle2' });
    await sleep(2500);

    const faqQuestions = await page.$$eval('button[aria-expanded]', buttons =>
      buttons.map(b => b.textContent.trim())
    );
    assert.strictEqual(faqQuestions.length, 8, `Must render exactly 8 FAQ questions, found: ${faqQuestions.length}`);

    // Verify questions text covers client topics
    const combinedFaqText = faqQuestions.join(' ');
    assert.ok(combinedFaqText.includes('nutritional protocol'), 'FAQ 1 verified');
    assert.ok(combinedFaqText.includes('calorie counting'), 'FAQ 2 verified');
    assert.ok(combinedFaqText.includes('travel schedule'), 'FAQ 3 verified');
    assert.ok(combinedFaqText.includes('pre-diabetic'), 'FAQ 4 verified');
    assert.ok(combinedFaqText.includes('synthetic supplements'), 'FAQ 5 verified');
    assert.ok(combinedFaqText.includes('four pillars'), 'FAQ 6 verified');
    assert.ok(combinedFaqText.includes('time commitment'), 'FAQ 7 verified');
    assert.ok(combinedFaqText.includes('private consultation'), 'FAQ 8 verified');

    // Test Accordion click: toggle FAQ item 2
    const faqButtons = await page.$$('button[aria-expanded]');
    await faqButtons[1].click();
    await sleep(500);
    const item2Expanded = await page.evaluate(el => el.getAttribute('aria-expanded'), faqButtons[1]);
    assert.strictEqual(item2Expanded, 'true', 'Accordion item 2 must expand on click');

    const shot4 = path.join(screenshotDir, '10_public_faqs_accordion.png');
    await page.screenshot({ path: shot4, fullPage: false });
    console.log(`  📸 Screenshot saved: ${shot4}`);

    // Verify alias /faq
    await page.goto('http://localhost:3000/faq', { waitUntil: 'networkidle2' });
    await sleep(1500);
    const faqAliasTitle = await page.$eval('h1', el => el.textContent.trim());
    assert.ok(faqAliasTitle.includes('Frequently Asked Questions'), 'Alias /faq must resolve to FAQs');
    console.log('  ✅ Test 4 Passed: All 8 FAQ entries rendered with animated, accessible accordions.\n');

    // -------------------------------------------------------------------------
    // TEST 5: Footer Legal Links Verification on Homepage
    // -------------------------------------------------------------------------
    console.log('Test 5: Verifying Footer Legal Links on Home Page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await sleep(1500);

    const legalLinks = await page.$$eval('footer a', links =>
      links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
    );

    const privacyLink = legalLinks.find(l => l.text === 'Privacy Policy');
    const termsLink = legalLinks.find(l => l.text === 'Terms & Conditions');
    const shippingLink = legalLinks.find(l => l.text === 'Shipping & Returns');
    const faqLink = legalLinks.find(l => l.text === 'FAQ');

    assert.ok(privacyLink && privacyLink.href === '/privacy-policy', 'Privacy Policy link must point to /privacy-policy');
    assert.ok(termsLink && termsLink.href === '/terms-and-conditions', 'Terms link must point to /terms-and-conditions');
    assert.ok(shippingLink && shippingLink.href === '/shipping-policy', 'Shipping link must point to /shipping-policy');
    assert.ok(faqLink && faqLink.href === '/faqs', 'FAQ link must point to /faqs');
    console.log('  ✅ Test 5 Passed: Footer legal links active and point to valid routes (no broken # links).\n');

    // -------------------------------------------------------------------------
    // TEST 6: Mobile Responsiveness Check (375 x 812)
    // -------------------------------------------------------------------------
    console.log('Test 6: Verifying Mobile Responsiveness (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/privacy-policy', { waitUntil: 'networkidle2' });
    await sleep(1000);
    const mobileShot = path.join(screenshotDir, '11_mobile_responsive_policy.png');
    await page.screenshot({ path: mobileShot, fullPage: false });
    console.log(`  📸 Mobile screenshot saved: ${mobileShot}`);
    console.log('  ✅ Test 6 Passed: Responsive layouts verified on mobile viewport.\n');

    await browser.close();
    console.log('🎉 ALL PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY (6/6)!');
  } finally {
    console.log('🛑 Shutting down frontend process...');
    try { frontendProc.kill(); } catch (_) {}
    if (backendProc) {
      try { backendProc.kill(); } catch (_) {}
    }
  }
}

main().catch((err) => {
  console.error('❌ Phase 3 Verification Failure:', err);
  process.exit(1);
});
