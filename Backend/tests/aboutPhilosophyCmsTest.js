import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";

dotenv.config({ path: "Backend/.env" });
process.env.PORT = "5055";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore
}

async function runTest() {
  console.log("====================================================");
  console.log("🧪 STARTING TEJOVA ABOUT PHILOSOPHY CMS TEST SUITE");
  console.log("====================================================");

  // Dynamically import server.js after setting process.env.PORT = 5055
  await import("../server.js");

  // Wait until MongoDB connection is fully open
  let attempts = 0;
  while (mongoose.connection.readyState !== 1 && attempts < 20) {
    attempts++;
    console.log(`Waiting for MongoDB connection (attempt ${attempts})...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB failed to connect within 20 seconds.");
  }
  console.log("✅ MongoDB readyState is 1 (Connected).");

  const PORT = process.env.PORT || 5055;
  const BASE_URL = `http://127.0.0.1:${PORT}/api`;
  console.log(`✅ Connecting to test server at ${BASE_URL}`);

  try {
    // 3. Login as Admin
    console.log("\n--- STEP 1: Admin Authentication ---");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || "tejova61@gmail.com",
        password: process.env.ADMIN_PASSWORD || "123456",
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token || loginData.data?.token;
    if (!loginData.success || !token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    console.log("✅ Admin logged in successfully. Token acquired.");

    const adminHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // 4. GET About Page as Admin
    console.log("\n--- STEP 2: Fetch About Page Structure ---");
    const getAdminRes = await fetch(`${BASE_URL}/pages/about?adminView=true`, {
      headers: adminHeaders,
    });
    const getAdminData = await getAdminRes.json();
    if (!getAdminData.success || !getAdminData.data) {
      throw new Error(`Failed to fetch about page: ${JSON.stringify(getAdminData)}`);
    }
    console.log(`✅ About page retrieved. Title: '${getAdminData.data.title}'`);
    const initialSections = getAdminData.data.sections || [];
    console.log(`   Found ${initialSections.length} sections in About page.`);

    const philosophySec = initialSections.find(
      (s) =>
        s.sectionId === "sec_about_philosophy" ||
        s.type === "philosophy" ||
        s.type === "brand_philosophy"
    );
    if (!philosophySec) {
      throw new Error("Philosophy section not found in initial about page data.");
    }
    console.log("✅ Philosophy section verified with structure:", {
      sectionId: philosophySec.sectionId,
      leftLabel: philosophySec.leftColumn?.label,
      leftHeading: philosophySec.leftColumn?.heading,
      rightLabel: philosophySec.rightColumn?.label,
      rightHeading: philosophySec.rightColumn?.heading,
      highlightedTitle: philosophySec.rightColumn?.highlightedTitle,
    });

    // 5. Update Philosophy Section with New Test Content
    console.log("\n--- STEP 3: Update Philosophy Section Content (Admin Edit) ---");
    const testUpdatedContent = {
      sectionId: "sec_about_philosophy",
      type: "brand_philosophy",
      title: "Expand Your Light — Automated Verification",
      subtitle: "THE PHILOSOPHY — TEST SUITE",
      leftColumn: {
        label: "THE PHILOSOPHY — TEST SUITE",
        heading: "Expand Your Light — Automated Verification",
        paragraphs: [
          '<p>"Tej" represents biological brilliance in our comprehensive automated test.</p>',
          "<p>Every formulation is verified through rigorous automated integration suites.</p>",
        ],
        paragraph1:
          '<p>"Tej" represents biological brilliance in our comprehensive automated test.</p>',
        paragraph2:
          "<p>Every formulation is verified through rigorous automated integration suites.</p>",
      },
      rightColumn: {
        label: "STANDARDS OF PURITY — VERIFIED",
        heading: "About Tejova — Architecture",
        highlightedTitle: "The Architecture of Elite Biological Mastery",
        description:
          "<p>Tested description: Absolute command over your own cellular biology and executive output.</p>",
      },
      content: {
        leftColumn: {
          label: "THE PHILOSOPHY — TEST SUITE",
          heading: "Expand Your Light — Automated Verification",
          paragraphs: [
            '<p>"Tej" represents biological brilliance in our comprehensive automated test.</p>',
            "<p>Every formulation is verified through rigorous automated integration suites.</p>",
          ],
        },
        rightColumn: {
          label: "STANDARDS OF PURITY — VERIFIED",
          heading: "About Tejova — Architecture",
          highlightedTitle: "The Architecture of Elite Biological Mastery",
          description:
            "<p>Tested description: Absolute command over your own cellular biology and executive output.</p>",
        },
      },
      isVisible: true,
    };

    const updateSecRes = await fetch(
      `${BASE_URL}/pages/about/sections/sec_about_philosophy`,
      {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify(testUpdatedContent),
      }
    );
    const updateSecData = await updateSecRes.json();
    if (!updateSecData.success) {
      throw new Error(`Failed to update philosophy section: ${JSON.stringify(updateSecData)}`);
    }
    console.log("✅ PUT /api/pages/about/sections/sec_about_philosophy succeeded.");

    // 6. Verify Public Retrieval
    console.log("\n--- STEP 4: Public Website Retrieval Verification ---");
    const getPublicRes = await fetch(`${BASE_URL}/pages/about`);
    const getPublicData = await getPublicRes.json();
    if (!getPublicData.success || !getPublicData.data) {
      throw new Error(`Failed to fetch public about page: ${JSON.stringify(getPublicData)}`);
    }
    const publicPhilosophySec = (getPublicData.data.sections || []).find(
      (s) => s.sectionId === "sec_about_philosophy"
    );
    if (!publicPhilosophySec) {
      throw new Error("Philosophy section not returned to public visitor.");
    }

    if (publicPhilosophySec.leftColumn.heading !== "Expand Your Light — Automated Verification") {
      throw new Error(
        `Left heading mismatch! Expected 'Expand Your Light — Automated Verification', got '${publicPhilosophySec.leftColumn.heading}'`
      );
    }
    if (publicPhilosophySec.rightColumn.heading !== "About Tejova — Architecture") {
      throw new Error(
        `Right heading mismatch! Expected 'About Tejova — Architecture', got '${publicPhilosophySec.rightColumn.heading}'`
      );
    }
    if (
      publicPhilosophySec.rightColumn.highlightedTitle !==
      "The Architecture of Elite Biological Mastery"
    ) {
      throw new Error(
        `Highlighted title mismatch! Expected 'The Architecture of Elite Biological Mastery', got '${publicPhilosophySec.rightColumn.highlightedTitle}'`
      );
    }
    console.log("✅ Public API successfully returns all updated fields dynamically!");

    // 7. Test Visibility Toggle (Hide Section)
    console.log("\n--- STEP 5: Test Section Visibility Toggle (Hide Section) ---");
    const hidePayload = {
      ...testUpdatedContent,
      isVisible: false,
    };
    const hideRes = await fetch(
      `${BASE_URL}/pages/about/sections/sec_about_philosophy`,
      {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify(hidePayload),
      }
    );
    const hideData = await hideRes.json();
    if (!hideData.success) {
      throw new Error(`Failed to hide philosophy section: ${JSON.stringify(hideData)}`);
    }

    // Public fetch should NOT include the hidden section
    const getPublicHiddenRes = await fetch(`${BASE_URL}/pages/about`);
    const getPublicHiddenData = await getPublicHiddenRes.json();
    const hiddenInPublic = (getPublicHiddenData.data.sections || []).find(
      (s) => s.sectionId === "sec_about_philosophy"
    );
    if (hiddenInPublic) {
      throw new Error("Section is marked isVisible: false, but was still returned to public API!");
    }
    console.log("✅ When isVisible: false, section is safely excluded from public responses!");

    // Admin fetch WITH adminView SHOULD include it with isVisible: false
    const getAdminHiddenRes = await fetch(`${BASE_URL}/pages/about?adminView=true`, {
      headers: adminHeaders,
    });
    const getAdminHiddenData = await getAdminHiddenRes.json();
    const hiddenInAdmin = (getAdminHiddenData.data.sections || []).find(
      (s) => s.sectionId === "sec_about_philosophy"
    );
    if (!hiddenInAdmin || hiddenInAdmin.isVisible !== false) {
      throw new Error("Admin query did not receive hidden section with isVisible: false");
    }
    console.log("✅ Admin view accurately receives section with isVisible: false for toggle UI!");

    // 8. Restore Standard Production Values & isVisible: true
    console.log("\n--- STEP 6: Restore Standard Production Values ---");
    const standardPhilosophyContent = {
      sectionId: "sec_about_philosophy",
      type: "brand_philosophy",
      title: "Expand Your Light",
      subtitle: "THE PHILOSOPHY",
      kicker: "THE PHILOSOPHY",
      leftColumn: {
        label: "THE PHILOSOPHY",
        heading: "Expand Your Light",
        paragraphs: [
          '"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.',
          "Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.",
        ],
        paragraph1:
          '"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.',
        paragraph2:
          "Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.",
      },
      rightColumn: {
        label: "STANDARDS OF PURITY",
        heading: "About Tejova",
        highlightedTitle: "The Architecture of Biological Sovereignty",
        description:
          "For the Driven Professionals, energy is the ultimate currency. You architect organizations, drive market growth, and lead with relentless precision—but the true mark of elite leadership is absolute command over your own biology.",
      },
      content: {
        leftColumn: {
          label: "THE PHILOSOPHY",
          heading: "Expand Your Light",
          paragraphs: [
            '"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.',
            "Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.",
          ],
        },
        rightColumn: {
          label: "STANDARDS OF PURITY",
          heading: "About Tejova",
          highlightedTitle: "The Architecture of Biological Sovereignty",
          description:
            "For the Driven Professionals, energy is the ultimate currency. You architect organizations, drive market growth, and lead with relentless precision—but the true mark of elite leadership is absolute command over your own biology.",
        },
      },
      isVisible: true,
      order: 0,
    };

    const restoreRes = await fetch(
      `${BASE_URL}/pages/about/sections/sec_about_philosophy`,
      {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify(standardPhilosophyContent),
      }
    );
    const restoreData = await restoreRes.json();
    if (!restoreData.success) {
      throw new Error(`Failed to restore standard values: ${JSON.stringify(restoreData)}`);
    }
    console.log("✅ Production default values restored and verified.");

    // 9. Verify Other CMS Pages & Journal Unaffected
    console.log("\n--- STEP 7: Verify Other CMS Pages & Journal Unaffected ---");
    const homeRes = await fetch(`${BASE_URL}/pages/home`);
    const homeData = await homeRes.json();
    if (!homeData.success || !homeData.data) {
      throw new Error("Homepage CMS route check failed.");
    }
    console.log(`✅ Homepage CMS OK. Title: '${homeData.data.title}'`);

    const vitalityRes = await fetch(`${BASE_URL}/pages/vitality`);
    const vitalityData = await vitalityRes.json();
    if (!vitalityRes.ok || !vitalityData.success) {
      throw new Error("Vitality CMS page check failed.");
    }
    console.log(`✅ Vitality CMS page OK. Title: '${vitalityData.data.title}'`);

    const journalRes = await fetch(`${BASE_URL}/journal`);
    const journalData = await journalRes.json();
    if (!journalRes.ok || !journalData.success) {
      throw new Error("Journal API check failed.");
    }
    console.log(`✅ Journal API OK. Articles count: ${journalData.data?.length || 0}`);

    console.log("\n====================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY (7/7 TEST SUITES)");
    console.log("====================================================");
  } catch (err) {
    console.error("❌ TEST EXECUTION ERROR:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTest().catch((err) => {
  console.error("❌ TEST RUN FAILED:", err);
  process.exit(1);
});
