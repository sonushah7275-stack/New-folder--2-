import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import puppeteer from "puppeteer-core";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const screenshotDir = path.resolve(
  "C:/Users/Sonu/.gemini/antigravity/brain/85a3b13b-25f5-4a81-bc08-adf313e33b5f/screenshots"
);
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const edgePath =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  console.log("====================================================");
  console.log("🌐 STARTING END-TO-END BROWSER WORKFLOW TEST");
  console.log("====================================================");

  const procs = [];

  // 1. Start Backend on port 5000
  console.log("Starting Backend server on port 5000...");
  const backendProc = spawn("node", ["server.js"], {
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, PORT: "5000" },
    stdio: "pipe",
  });
  procs.push(backendProc);

  backendProc.stdout.on("data", (d) => process.stdout.write(`[Backend] ${d}`));
  backendProc.stderr.on("data", (d) => process.stderr.write(`[Backend ERR] ${d}`));

  // 2. Start Admin Dashboard on port 3001
  console.log("Starting Admin Dashboard Vite server on port 3001...");
  const adminProc = spawn("npx", ["vite", "--port", "3001", "--host"], {
    cwd: path.resolve(__dirname, "../../TEJOVA-Admin-Dashboard"),
    env: { ...process.env },
    shell: true,
    stdio: "pipe",
  });
  procs.push(adminProc);

  adminProc.stdout.on("data", (d) => process.stdout.write(`[Admin] ${d}`));
  adminProc.stderr.on("data", (d) => process.stderr.write(`[Admin ERR] ${d}`));

  // 3. Start Public Frontend on port 3000
  console.log("Starting Public Frontend Vite server on port 3000...");
  const publicProc = spawn("npx", ["vite", "--port", "3000", "--host"], {
    cwd: path.resolve(__dirname, "../../TEJOVA"),
    env: { ...process.env },
    shell: true,
    stdio: "pipe",
  });
  procs.push(publicProc);

  publicProc.stdout.on("data", (d) => process.stdout.write(`[Frontend] ${d}`));
  publicProc.stderr.on("data", (d) => process.stderr.write(`[Frontend ERR] ${d}`));

  let browser;

  try {
    console.log("⏳ Waiting for Backend (http://localhost:5000/api/health)...");
    await waitForUrl("http://localhost:5000/api/health");
    console.log("✅ Backend is ready.");

    console.log("⏳ Waiting for Admin Dashboard (http://localhost:3001)...");
    await waitForUrl("http://localhost:3001");
    console.log("✅ Admin Dashboard is ready.");

    console.log("⏳ Waiting for Public Frontend (http://localhost:3000)...");
    await waitForUrl("http://localhost:3000");
    console.log("✅ Public Frontend is ready.");

    // Launch Browser
    console.log("\n🚀 Launching Microsoft Edge browser via Puppeteer...");
    browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Track console messages and errors
    const consoleLogs = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleLogs.push(`[Browser ERROR] ${msg.text()}`);
      }
    });

    // -------------------------------------------------------------------------
    // STEP 1: Admin Login
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 1: Admin Login ---");
    await page.goto("http://localhost:3001/admin/login", {
      waitUntil: "networkidle2",
    });

    await page.type('input[type="email"]', process.env.ADMIN_EMAIL || "tejova61@gmail.com");
    await page.type('input[type="password"]', process.env.ADMIN_PASSWORD || "123456");
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
    await sleep(2000);
    console.log("✅ Admin logged in. Current URL:", page.url());

    // -------------------------------------------------------------------------
    // STEP 2: Navigate to CMS -> About Page -> Philosophy Section
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 2: Navigate to Philosophy Section CMS ---");
    await page.goto("http://localhost:3001/admin/pages?page=about&section=philosophy", {
      waitUntil: "networkidle2",
    });
    await sleep(2000);

    // Verify editor loaded
    const headingInput = await page.$('input[placeholder="e.g. Expand Your Light"]');
    if (!headingInput) {
      throw new Error("Philosophy section editor heading input not found in DOM.");
    }
    const currentHeading = await page.evaluate((el) => el.value, headingInput);
    console.log(`✅ Philosophy Section Editor loaded. Current heading: '${currentHeading}'`);

    await page.screenshot({
      path: path.join(screenshotDir, "01_admin_philosophy_editor.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 01_admin_philosophy_editor.png");

    // -------------------------------------------------------------------------
    // STEP 3: Change Left Heading, Both Paragraphs, Right Heading, Title, Description
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 3: Edit All 6 Content Fields ---");

    const TEST_LEFT_HEADING = "Expand Your Light (E2E Test Heading)";
    const TEST_LEFT_P1 = "Tej represents biological brilliance in our automated browser verification test.";
    const TEST_LEFT_P2 = "Every formulation is verified through live automated end-to-end browser workflows.";
    const TEST_RIGHT_LABEL = "STANDARDS OF PURITY — E2E";
    const TEST_RIGHT_HEADING = "About Tejova (E2E Verified)";
    const TEST_RIGHT_TITLE = "The Architecture of Elite Biological Mastery (E2E)";
    const TEST_RIGHT_DESC = "For the Driven Professionals, energy is the ultimate currency. Validated via end-to-end test.";

    async function setNativeInput(selector, value) {
      await page.waitForSelector(selector);
      await page.evaluate((sel, val) => {
        const input = document.querySelector(sel);
        if (!input) return;
        const prototype = Object.getPrototypeOf(input);
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
        if (valueSetter) {
          valueSetter.call(input, val);
        } else {
          input.value = val;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, selector, value);
    }

    // 1. Left Section Label
    await setNativeInput('input[placeholder="e.g. THE PHILOSOPHY"]', "THE PHILOSOPHY — E2E");

    // 2. Left Main Heading
    await setNativeInput('input[placeholder="e.g. Expand Your Light"]', TEST_LEFT_HEADING);

    // 3. Right Section Label
    await setNativeInput('input[placeholder="e.g. STANDARDS OF PURITY"]', TEST_RIGHT_LABEL);

    // 4. Right Card Heading
    await setNativeInput('input[placeholder="e.g. About Tejova"]', TEST_RIGHT_HEADING);

    // 5. Right Highlighted Title
    await setNativeInput(
      'input[placeholder="e.g. The Architecture of Biological Sovereignty"]',
      TEST_RIGHT_TITLE
    );

    // 6. RichText Editors (Left P1, Left P2, Right Description)
    // Click into each Tiptap editor and use keyboard replacement
    const editors = await page.$$('.tiptap.ProseMirror');
    if (editors[0]) {
      await editors[0].click();
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(TEST_LEFT_P1, { delay: 5 });
    }
    if (editors[1]) {
      await editors[1].click();
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(TEST_LEFT_P2, { delay: 5 });
    }
    if (editors[2]) {
      await editors[2].click();
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(TEST_RIGHT_DESC, { delay: 5 });
    }

    console.log("✅ All 6 fields populated with test values in the browser UI.");

    await page.screenshot({
      path: path.join(screenshotDir, "02_admin_edited_fields.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 02_admin_edited_fields.png");

    // -------------------------------------------------------------------------
    // STEP 4: Save & Publish Changes
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 4: Save and Publish Changes ---");
    // Find and click "Save Changes" button
    const saveButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(
        (b) =>
          b.textContent.includes("Save Changes") ||
          b.textContent.includes("Save Philosophy Section")
      );
    });

    if (saveButton) {
      await saveButton.click();
      console.log("Clicked Save button.");
    }
    await sleep(3000);

    await page.screenshot({
      path: path.join(screenshotDir, "03_admin_save_success.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 03_admin_save_success.png");

    // -------------------------------------------------------------------------
    // STEP 5: Open Public About Page and Confirm All Updated Values
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 5: Verify Public About Page Content ---");
    const publicPage = await browser.newPage();
    await publicPage.setViewport({ width: 1440, height: 900 });

    await publicPage.goto("http://localhost:3000/about", {
      waitUntil: "networkidle2",
    });
    await sleep(2500);

    const publicContent = await publicPage.evaluate(() => {
      return {
        headingText: document.body.innerText,
        html: document.body.innerHTML,
      };
    });

    const hasLeftHeading = publicContent.headingText.includes(
      "Expand Your Light (E2E Test Heading)"
    );
    const hasRightHeading = publicContent.headingText.includes(
      "About Tejova (E2E Verified)"
    );
    const hasHighlightedTitle = publicContent.headingText.includes(
      "The Architecture of Elite Biological Mastery (E2E)"
    );
    const hasP1 = publicContent.headingText.includes(
      "Tej represents biological brilliance in our automated browser verification test."
    );
    const hasDesc = publicContent.headingText.includes(
      "For the Driven Professionals, energy is the ultimate currency. Validated via end-to-end test."
    );

    console.log("Verification results on public /about page:");
    console.log(`  - Left Heading Rendered: ${hasLeftHeading}`);
    console.log(`  - Right Card Heading Rendered: ${hasRightHeading}`);
    console.log(`  - Right Highlighted Title Rendered: ${hasHighlightedTitle}`);
    console.log(`  - Left First Paragraph Rendered: ${hasP1}`);
    console.log(`  - Right Description Rendered: ${hasDesc}`);

    if (!hasLeftHeading || !hasRightHeading || !hasHighlightedTitle || !hasP1 || !hasDesc) {
      throw new Error("One or more updated CMS fields failed to render on public About page!");
    }
    console.log("✅ All updated values appear correctly on the public About page!");

    await publicPage.screenshot({
      path: path.join(screenshotDir, "04_public_about_updated.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 04_public_about_updated.png");

    // -------------------------------------------------------------------------
    // STEP 6: Refresh Public Browser and Confirm Persistence
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 6: Refresh Browser to Confirm Persistence ---");
    await publicPage.reload({ waitUntil: "networkidle2" });
    await sleep(2000);

    const reloadedText = await publicPage.evaluate(() => document.body.innerText);
    if (!reloadedText.includes("Expand Your Light (E2E Test Heading)")) {
      throw new Error("Updated values did not persist after browser refresh!");
    }
    console.log("✅ Updated CMS values persist across browser refresh!");

    // -------------------------------------------------------------------------
    // STEP 7: Test Responsive Mobile Layout (375x667)
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 7: Test Responsive Mobile Layout (375x667) ---");
    await publicPage.setViewport({ width: 375, height: 667, isMobile: true });
    await sleep(1000);

    await publicPage.screenshot({
      path: path.join(screenshotDir, "05_public_about_mobile.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 05_public_about_mobile.png (Mobile Viewport 375x667)");

    // -------------------------------------------------------------------------
    // STEP 8: Test Section Visibility Toggle
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 8: Test Section Visibility Toggle ---");
    await page.bringToFront();

    // Toggle Visibility Checkbox
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.click();
      }
    });
    await sleep(500);

    // Click Save
    const saveButton2 = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(
        (b) =>
          b.textContent.includes("Save Changes") ||
          b.textContent.includes("Save Philosophy Section")
      );
    });
    if (saveButton2) await saveButton2.click();
    await sleep(3000);

    // Refresh public page
    await publicPage.bringToFront();
    await publicPage.reload({ waitUntil: "networkidle2" });
    await sleep(2000);

    const hiddenPageText = await publicPage.evaluate(() => document.body.innerText);
    const isHidden = !hiddenPageText.includes("Expand Your Light (E2E Test Heading)");
    console.log(`  - Philosophy Section is hidden on public site: ${isHidden}`);
    if (!isHidden) {
      throw new Error("Section visibility toggle failed: section is still visible when disabled!");
    }
    console.log("✅ Visibility toggle verified: section is safely hidden from public visitors!");

    await publicPage.screenshot({
      path: path.join(screenshotDir, "06_public_about_hidden_section.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 06_public_about_hidden_section.png");

    // -------------------------------------------------------------------------
    // STEP 9: Restore Original Production Values & Reset to Default
    // -------------------------------------------------------------------------
    console.log("\n--- STEP 9: Restore Original Production Values ---");
    await page.bringToFront();

    // Click Reset Defaults
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const resetBtn = buttons.find((b) => b.textContent.includes("Reset Defaults"));
      if (resetBtn) resetBtn.click();
    });
    await sleep(1000);

    // Ensure isVisible is checked
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) {
        checkbox.click();
      }
    });

    // Save restored defaults
    const saveButton3 = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(
        (b) =>
          b.textContent.includes("Save Changes") ||
          b.textContent.includes("Save Philosophy Section")
      );
    });
    if (saveButton3) await saveButton3.click();
    await sleep(3000);

    // Verify public site restored
    await publicPage.bringToFront();
    await publicPage.setViewport({ width: 1440, height: 900 });
    await publicPage.reload({ waitUntil: "networkidle2" });
    await sleep(2000);

    const finalPublicText = await publicPage.evaluate(() => document.body.innerText);
    const restored =
      finalPublicText.includes("Expand Your Light") &&
      finalPublicText.includes("About Tejova") &&
      finalPublicText.includes("The Architecture of Biological Sovereignty");
    console.log(`  - Production values restored on public site: ${restored}`);
    if (!restored) {
      throw new Error("Failed to restore production default values!");
    }
    console.log("✅ Production values restored and verified on public site!");

    await publicPage.screenshot({
      path: path.join(screenshotDir, "07_public_about_restored.png"),
      fullPage: true,
    });
    console.log("📸 Saved: 07_public_about_restored.png");

    console.log("\n====================================================");
    console.log("🏆 COMPLETE END-TO-END WORKFLOW SUCCEEDED 100%");
    console.log("====================================================");
  } finally {
    if (browser) await browser.close();
    procs.forEach((p) => {
      try {
        p.kill("SIGTERM");
      } catch (_) {}
    });
  }
}

main().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});
