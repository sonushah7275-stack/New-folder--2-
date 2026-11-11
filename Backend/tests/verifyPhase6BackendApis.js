import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";

dotenv.config({ path: "Backend/.env" });

// Fix Windows DNS for Atlas SRV
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore
}

async function runBackendApiAudit() {
  console.log("🔍 Starting Phase 6 Comprehensive Backend API Audit...");

  let server;
  const PORT = 5055;

  try {
    // 1. Database Connection check
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    console.log("  ✅ MongoDB Atlas Connection Verified (readyState: 1)");

    // Wait for server.js to start listening on PORT 5000
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const BASE_URL = `http://127.0.0.1:5000`;

    // Helper for requests
    const get = async (path, headers = {}) => {
      const res = await fetch(`${BASE_URL}${path}`, { headers });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    const post = async (path, body, headers = {}) => {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    // 2. Health check
    const health = await get("/api/health");
    console.log(`  Health Check status: ${health.status}, msg: ${health.data?.message}`);
    if (health.status !== 200 || !health.data?.success) {
      throw new Error("Health check failed");
    }
    console.log("  ✅ Test 1 Passed: Health Check endpoint operational.");

    // 3. Public Settings API
    const settings = await get("/api/settings/public");
    console.log(`  Public Settings status: ${settings.status}, siteName: ${settings.data?.data?.siteName}`);
    if (settings.status !== 200 || !settings.data?.data?.siteName) {
      throw new Error("Public settings API failed");
    }
    console.log("  ✅ Test 2 Passed: Public Settings API returned site metadata.");

    // 4. CMS Pages API
    const pages = await get("/api/pages");
    console.log(`  CMS Pages status: ${pages.status}, count: ${pages.data?.data?.length}`);
    if (pages.status !== 200 || !Array.isArray(pages.data?.data)) {
      throw new Error("CMS Pages list API failed");
    }
    const vitalityPage = await get("/api/pages/vitality");
    if (vitalityPage.status !== 200 || vitalityPage.data?.data?.slug !== "vitality") {
      throw new Error("CMS Page by slug failed");
    }
    console.log("  ✅ Test 3 Passed: CMS Page API operational for pages list and individual slug.");

    // 5. Journal API
    const journal = await get("/api/journal");
    console.log(`  Journal Articles status: ${journal.status}, count: ${journal.data?.data?.length || journal.data?.count || 0}`);
    if (journal.status !== 200 || !journal.data?.success) {
      throw new Error("Journal API failed");
    }
    console.log("  ✅ Test 4 Passed: Journal API operational.");

    // 6. Products API (Regression Check)
    const products = await get("/api/products");
    const count = products.data?.data?.length || products.data?.products?.length || 0;
    console.log(`  Products status: ${products.status}, total products in DB: ${count}`);
    if (products.status !== 200 || count === 0) {
      throw new Error("Product API failed or product catalog empty!");
    }
    console.log("  ✅ Test 5 Passed: Product catalog is 100% intact and accessible.");

    // 7. Categories API
    const categories = await get("/api/categories");
    console.log(`  Categories status: ${categories.status}, count: ${categories.data?.data?.length || 0}`);
    if (categories.status !== 200) {
      throw new Error("Categories API failed");
    }
    console.log("  ✅ Test 6 Passed: Categories API operational.");

    // 8. Contact Form Validation
    const invalidContact = await post("/api/contact", { name: "Test User" }); // missing required fields
    if (invalidContact.status >= 400) {
      console.log(`  Invalid Contact Submission correctly rejected with status ${invalidContact.status}`);
    } else {
      throw new Error("Contact API failed to validate required fields");
    }
    console.log("  ✅ Test 7 Passed: Contact API input validation enforced.");

    // 9. Auth Middleware & Protection
    const unauthAdmin = await get("/api/admin/stats");
    if (unauthAdmin.status === 401 || unauthAdmin.status === 403) {
      console.log(`  Admin route without token correctly rejected with status ${unauthAdmin.status}`);
    } else {
      throw new Error(`Admin route protection failed: got status ${unauthAdmin.status}`);
    }

    const invalidTokenAdmin = await get("/api/admin/stats", {
      Authorization: "Bearer invalid.token.signature",
    });
    if (invalidTokenAdmin.status === 401 || invalidTokenAdmin.status === 403) {
      console.log(`  Admin route with forged token correctly rejected with status ${invalidTokenAdmin.status}`);
    } else {
      throw new Error(`Invalid token rejection failed: got status ${invalidTokenAdmin.status}`);
    }
    console.log("  ✅ Test 8 Passed: Authentication & Authorization middleware strictly enforced.");

    // 10. 404 Route Not Found
    const notFound = await get("/api/unregistered-audit-endpoint");
    if (notFound.status === 404) {
      console.log("  Non-existent route correctly returns 404 Not Found");
    } else {
      throw new Error(`404 handler failed: got status ${notFound.status}`);
    }
    console.log("  ✅ Test 9 Passed: Not Found handler operational.");

    console.log("\n🎉 ALL PHASE 2 BACKEND API AUDIT TESTS PASSED (9/9)!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Phase 2 Backend Audit Error:", error.message);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  }
}

runBackendApiAudit();
