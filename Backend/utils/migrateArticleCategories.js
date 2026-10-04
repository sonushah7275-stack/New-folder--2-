import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Journal from "../models/Journal.js";
import { slugify } from "./slugify.js";

dotenv.config();

/**
 * Migration script to ensure TEJOVA blog categories strictly match the 4 Pillars:
 * Vitality, Nourishment, Lifestyle, Longevity.
 * Remaps existing MongoDB Journal articles to the proper pillar category.
 * Deactivates deprecated legacy categories (Mindfulness, Wellness, Supplements, Yoga).
 * Run manually via: node utils/migrateArticleCategories.js
 */
export const migrateArticleCategories = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting Article Category Migration...");

    const allowedCategories = [
      { name: "Vitality", slug: "vitality", description: "Peak-Impact energy and bio-energetic vitality protocols.", sortOrder: 1 },
      { name: "Nourishment", slug: "nourishment", description: "Conscious nutrition, whole foods, and microbiome balance.", sortOrder: 2 },
      { name: "Lifestyle", slug: "lifestyle", description: "Grounding rituals, daily habits, and sovereign mindset.", sortOrder: 3 },
      { name: "Longevity", slug: "longevity", description: "Cellular renewal, enduring health, and timeless wellbeing.", sortOrder: 4 },
    ];

    const categoryMap = new Map();

    // 1. Ensure 4 Core Pillar Categories exist and are ACTIVE
    for (const catDef of allowedCategories) {
      let cat = await Category.findOne({
        $or: [{ slug: catDef.slug }, { name: catDef.name }],
      });
      if (!cat) {
        cat = await Category.create({
          name: catDef.name,
          slug: catDef.slug,
          description: catDef.description,
          sortOrder: catDef.sortOrder,
          isActive: true,
        });
        console.log(`✨ Created Pillar Category: '${cat.name}' (${cat._id})`);
      } else {
        cat.isActive = true;
        cat.sortOrder = catDef.sortOrder;
        await cat.save();
        console.log(`✅ Verified Active Pillar Category: '${cat.name}' (${cat._id})`);
      }
      categoryMap.set(cat.name.toLowerCase(), cat._id);
      categoryMap.set(cat.slug.toLowerCase(), cat._id);
    }

    // 2. Deactivate legacy categories for articles (Wellness, Mindfulness, Supplements, Yoga)
    const deprecatedSlugs = ["wellness", "mindfulness", "supplements", "yoga"];
    for (const dSlug of deprecatedSlugs) {
      const depCat = await Category.findOne({ slug: dSlug });
      if (depCat) {
        depCat.isActive = false;
        await depCat.save();
        console.log(`🔒 Deactivated legacy category: '${depCat.name}' (${depCat._id})`);
      }
    }

    // 3. Remap existing MongoDB Articles
    const articles = await Journal.find({});
    let migratedCount = 0;

    const vitalityId = categoryMap.get("vitality");
    const nourishmentId = categoryMap.get("nourishment");
    const lifestyleId = categoryMap.get("lifestyle");
    const longevityId = categoryMap.get("longevity");

    for (const article of articles) {
      const titleLower = article.title ? article.title.toLowerCase() : "";
      let targetCatId = null;

      if (titleLower.includes("nourishment") || titleLower.includes("food") || titleLower.includes("diet")) {
        targetCatId = nourishmentId;
      } else if (titleLower.includes("vitality") || titleLower.includes("sovereign body") || titleLower.includes("energy")) {
        targetCatId = vitalityId;
      } else if (titleLower.includes("longevity") || titleLower.includes("cellular")) {
        targetCatId = longevityId;
      } else if (titleLower.includes("lifestyle") || titleLower.includes("habit") || titleLower.includes("mindful")) {
        targetCatId = lifestyleId;
      } else {
        // Fallback default
        targetCatId = vitalityId;
      }

      if (!article.category || article.category.toString() !== targetCatId.toString()) {
        article.category = targetCatId;
        await article.save();
        migratedCount++;
        console.log(`✅ Remapped Article '${article.title}' -> Category ID ${targetCatId}`);
      }
    }

    console.log(`🎉 Article Category Migration Complete. ${migratedCount} articles updated.`);
  } catch (error) {
    console.error("❌ Article Category Migration failed:", error.message);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].includes("migrateArticleCategories")) {
  migrateArticleCategories().then(() => process.exit(0)).catch(() => process.exit(1));
}
