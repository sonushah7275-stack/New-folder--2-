import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

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
  console.log('🚀 Starting Backend and Admin Dashboard services for UI screenshot capture...');

  // 1. Start Backend on port 5000
  const backendProc = spawn('node', ['server.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: '5000' },
    stdio: 'pipe',
  });

  backendProc.stdout.on('data', (d) => process.stdout.write(`[Backend] ${d}`));
  backendProc.stderr.on('data', (d) => process.stderr.write(`[Backend ERR] ${d}`));

  // 2. Start Admin Dashboard on port 3001
  const adminProc = spawn('npx', ['vite', '--port', '3001', '--host'], {
    cwd: path.resolve(__dirname, '../../TEJOVA-Admin-Dashboard'),
    env: { ...process.env },
    shell: true,
    stdio: 'pipe',
  });

  adminProc.stdout.on('data', (d) => process.stdout.write(`[Admin] ${d}`));
  adminProc.stderr.on('data', (d) => process.stderr.write(`[Admin ERR] ${d}`));

  try {
    console.log('⏳ Waiting for Backend (http://localhost:5000/api/settings/public)...');
    await waitForUrl('http://localhost:5000/api/settings/public', 30000);
    console.log('✅ Backend is live on port 5000.');

    console.log('⏳ Waiting for Admin Dashboard (http://localhost:3001)...');
    await waitForUrl('http://localhost:3001', 30000);
    console.log('✅ Admin Dashboard is live on port 3001.');

    // 3. Login to obtain JWT Token
    console.log('🔑 Authenticating as admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'tejova61@gmail.com',
        password: process.env.ADMIN_PASSWORD || '123456',
      }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log('✅ Admin login succeeded, token acquired.');

    // 4. Launch Headless Edge via Puppeteer
    console.log('🌐 Launching Microsoft Edge...');
    const browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,950'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 950 });

    // Inject Auth Token into localStorage
    await page.goto('http://localhost:3001/admin/login', { waitUntil: 'networkidle2' });
    await page.evaluate((tok, usr) => {
      localStorage.setItem('tejova_admin_token', tok);
      localStorage.setItem('tejova_admin_user', JSON.stringify(usr));
    }, token, loginData.user);

    // ----------------------------------------------------
    // SCREENSHOT 1: CMS Page Selector (13 Pages)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 1: CMS Page Selector...');
    await page.goto('http://localhost:3001/admin/pages', { waitUntil: 'networkidle2' });
    await sleep(2000);
    const shot1Path = path.join(screenshotDir, '01_cms_page_selector_13_pages.png');
    await page.screenshot({ path: shot1Path, fullPage: false });
    console.log(`  Saved: ${shot1Path}`);

    // ----------------------------------------------------
    // SCREENSHOT 2: Vitality Card Editor (4 Disciplines)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 2: Vitality Four-Pillar Card Editor...');
    // Click "Vitality" button in page tabs
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const vitBtn = buttons.find(b => b.textContent.trim() === 'Vitality');
      if (vitBtn) vitBtn.click();
    });
    await sleep(2500);
    // Scroll down to cards section
    await page.evaluate(() => {
      const cardsHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Sub-Cards'));
      if (cardsHeader) cardsHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    const shot2Path = path.join(screenshotDir, '02_vitality_card_editor.png');
    await page.screenshot({ path: shot2Path, fullPage: false });
    console.log(`  Saved: ${shot2Path}`);

    // ----------------------------------------------------
    // SCREENSHOT 3: Lifestyle Card Editor (4 Pillars)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 3: Lifestyle Four-Pillar Card Editor...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lifeBtn = buttons.find(b => b.textContent.trim() === 'Lifestyle');
      if (lifeBtn) lifeBtn.click();
    });
    await sleep(2500);
    await page.evaluate(() => {
      const cardsHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Sub-Cards'));
      if (cardsHeader) cardsHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    const shot3Path = path.join(screenshotDir, '03_lifestyle_card_editor.png');
    await page.screenshot({ path: shot3Path, fullPage: false });
    console.log(`  Saved: ${shot3Path}`);

    // ----------------------------------------------------
    // SCREENSHOT 4: Longevity Card Editor (4 Pillars)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 4: Longevity Four-Pillar Card Editor...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const longBtn = buttons.find(b => b.textContent.trim() === 'Longevity');
      if (longBtn) longBtn.click();
    });
    await sleep(2500);
    await page.evaluate(() => {
      const cardsHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Sub-Cards'));
      if (cardsHeader) cardsHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    const shot4Path = path.join(screenshotDir, '04_longevity_card_editor.png');
    await page.screenshot({ path: shot4Path, fullPage: false });
    console.log(`  Saved: ${shot4Path}`);

    // ----------------------------------------------------
    // SCREENSHOT 5: General Settings (Emails & Nagpur Address)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 5: General Settings...');
    await page.goto('http://localhost:3001/admin/settings', { waitUntil: 'networkidle2' });
    await sleep(2000);
    const shot5Path = path.join(screenshotDir, '05_general_settings.png');
    await page.screenshot({ path: shot5Path, fullPage: false });
    console.log(`  Saved: ${shot5Path}`);

    // ----------------------------------------------------
    // SCREENSHOT 6: Social Media Settings (All 6 Platforms)
    // ----------------------------------------------------
    console.log('📸 Capturing Screenshot 6: Social Media Settings...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const socialTab = buttons.find(b => b.textContent.includes('Social Media'));
      if (socialTab) socialTab.click();
    });
    await sleep(1000);
    const shot6Path = path.join(screenshotDir, '06_social_media_settings.png');
    await page.screenshot({ path: shot6Path, fullPage: false });
    console.log(`  Saved: ${shot6Path}`);

    await browser.close();
    console.log('🎉 All 6 Screenshots Captured Successfully!');
  } finally {
    console.log('🛑 Shutting down background processes...');
    try { backendProc.kill(); } catch (_) {}
    try { adminProc.kill(); } catch (_) {}
  }
}

main().catch((err) => {
  console.error('❌ Error during screenshot capture:', err);
  process.exit(1);
});
