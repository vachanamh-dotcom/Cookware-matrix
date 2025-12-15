// backend/run-scrapers.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Cookware = require("./models/Cookware");

// Import all scrapers
const scrapePrestige = require("./scrapers/prestige");
const scrapeHawkinsPdf = require("./scrapers/hawkins");
const scrapePigeon = require("./scrapers/pigeon");
const scrapeMeyer = require("./scrapers/meyer");
const scrapeButterfly = require("./scrapers/butterfly");

// Allowed categories for validation
const ALLOWED_CATEGORIES = [
  "Pressure Cooker",
  "Frying Pan",
  "Sauce Pan",
  "Kadai",
  "Dosa Tawa",
  "Paddu Pan"
];

// Normalize and validate category
const normalizeCategory = (category) => {
  if (!category) return null;
  const normalized = category.trim();
  const match = ALLOWED_CATEGORIES.find(
    allowed => allowed.toLowerCase() === normalized.toLowerCase()
  );
  return match || null;
};

// Filter and normalize products
const processProducts = (products) => {
  return products
    .map(product => {
      // Normalize category
      const normalizedCategory = normalizeCategory(product.category);
      if (!normalizedCategory) {
        console.log(`⚠️  Skipping product with invalid category: "${product.category}" - ${product.title}`);
        return null;
      }
      
      return {
        ...product,
        category: normalizedCategory
      };
    })
    .filter(Boolean); // Remove null entries
};

(async () => {
  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("║          COOKWARE MATRIX - FULL SCRAPER            ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  let totalScraped = 0;
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  try {
    console.log("📡 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully\n");

    // Array to store all scraped products
    const allProducts = [];

    // --- PRESTIGE SCRAPER ---
    console.log("┌────────────────────────────────────────────────────┐");
    console.log("│ 🏭 PRESTIGE SCRAPER                                │");
    console.log("└────────────────────────────────────────────────────┘");
    try {
      const prestigeProducts = await scrapePrestige();
      const processed = processProducts(prestigeProducts || []);
      allProducts.push(...processed);
      console.log(`✅ Prestige: ${processed.length} products scraped\n`);
    } catch (err) {
      console.error(`❌ Prestige scraper failed: ${err.message}\n`);
      totalErrors++;
    }

    // --- HAWKINS PDF SCRAPER ---
    console.log("┌────────────────────────────────────────────────────┐");
    console.log("│ 📄 HAWKINS PDF SCRAPER                             │");
    console.log("└────────────────────────────────────────────────────┘");
    try {
      const hawkinsProducts = await scrapeHawkinsPdf();
      const processed = processProducts(hawkinsProducts || []);
      allProducts.push(...processed);
      console.log(`✅ Hawkins: ${processed.length} products scraped\n`);
    } catch (err) {
      console.error(`❌ Hawkins scraper failed: ${err.message}\n`);
      totalErrors++;
    }

    // --- PIGEON SCRAPER ---
    console.log("┌────────────────────────────────────────────────────┐");
    console.log("│ 🐦 PIGEON SCRAPER                                  │");
    console.log("└────────────────────────────────────────────────────┘");
    try {
      const pigeonProducts = await scrapePigeon();
      const processed = processProducts(pigeonProducts || []);
      allProducts.push(...processed);
      console.log(`✅ Pigeon: ${processed.length} products scraped\n`);
    } catch (err) {
      console.error(`❌ Pigeon scraper failed: ${err.message}\n`);
      totalErrors++;
    }

    // --- MEYER SCRAPER ---
    console.log("┌────────────────────────────────────────────────────┐");
    console.log("│ 🔥 MEYER SCRAPER                                   │");
    console.log("└────────────────────────────────────────────────────┘");
    try {
      const meyerProducts = await scrapeMeyer();
      const processed = processProducts(meyerProducts || []);
      allProducts.push(...processed);
      console.log(`✅ Meyer: ${processed.length} products scraped\n`);
    } catch (err) {
      console.error(`❌ Meyer scraper failed: ${err.message}\n`);
      totalErrors++;
    }

    // --- BUTTERFLY SCRAPER ---
    console.log("┌────────────────────────────────────────────────────┐");
    console.log("│ 🦋 BUTTERFLY SCRAPER                               │");
    console.log("└────────────────────────────────────────────────────┘");
    try {
      const butterflyProducts = await scrapeButterfly();
      const processed = processProducts(butterflyProducts || []);
      allProducts.push(...processed);
      console.log(`✅ Butterfly: ${processed.length} products scraped\n`);
    } catch (err) {
      console.error(`❌ Butterfly scraper failed: ${err.message}\n`);
      totalErrors++;
    }

    // --- INSERT ALL PRODUCTS ---
    totalScraped = allProducts.length;
    
    if (allProducts.length > 0) {
      console.log("┌────────────────────────────────────────────────────┐");
      console.log("│ 💾 INSERTING INTO DATABASE                         │");
      console.log("└────────────────────────────────────────────────────┘");
      console.log(`📦 Total products to insert: ${allProducts.length}\n`);

      try {
        // Use insertMany with ordered: false to continue on duplicate errors
        const result = await Cookware.insertMany(allProducts, { 
          ordered: false,
          rawResult: true 
        });
        
        totalInserted = result.insertedCount || allProducts.length;
        console.log(`✅ Successfully inserted ${totalInserted} products`);
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key errors
          totalInserted = err.insertedDocs?.length || 0;
          totalSkipped = allProducts.length - totalInserted;
          console.log(`✅ Inserted ${totalInserted} new products`);
          console.log(`⚠️  Skipped ${totalSkipped} duplicate products`);
        } else {
          throw err;
        }
      }
    } else {
      console.log("⚠️  No products to insert\n");
    }

    // --- FINAL SUMMARY ---
    console.log("\n╔════════════════════════════════════════════════════╗");
    console.log("║               SCRAPING SUMMARY                     ║");
    console.log("╠════════════════════════════════════════════════════╣");
    console.log(`║ 📊 Total scraped:        ${String(totalScraped).padStart(4)} products       ║`);
    console.log(`║ ✅ Successfully inserted: ${String(totalInserted).padStart(4)} products       ║`);
    console.log(`║ ⚠️  Skipped (duplicates): ${String(totalSkipped).padStart(4)} products       ║`);
    console.log(`║ ❌ Scraper errors:        ${String(totalErrors).padStart(4)} scrapers        ║`);
    console.log("╚════════════════════════════════════════════════════╝\n");

    // --- DATABASE STATS ---
    const totalInDb = await Cookware.countDocuments();
    const categoryCounts = await Cookware.aggregate([
      { $match: { category: { $in: ALLOWED_CATEGORIES } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log("╔════════════════════════════════════════════════════╗");
    console.log("║            DATABASE STATISTICS                     ║");
    console.log("╠════════════════════════════════════════════════════╣");
    console.log(`║ 📦 Total products in DB: ${String(totalInDb).padStart(4)}                    ║`);
    console.log("╠════════════════════════════════════════════════════╣");
    console.log("║ 📂 Products by Category:                           ║");
    categoryCounts.forEach(cat => {
      const name = cat._id.padEnd(20);
      const count = String(cat.count).padStart(4);
      console.log(`║   • ${name} ${count}                    ║`);
    });
    console.log("╚════════════════════════════════════════════════════╝\n");

    console.log("✨ SCRAPING COMPLETE! ✨\n");

  } catch (err) {
    console.error("\n❌ CRITICAL ERROR:", err.message);
    console.error(err.stack);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.\n");
    process.exit(totalErrors > 0 ? 1 : 0);
  }
})();