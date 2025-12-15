const scrapeAmazon = require("./baseScraper");

const mapCategory = require("../utils/categoryMapper");
const detectMaterial = require("../utils/materialDetector");
const detectBrand = require("../utils/brandDetector");
const {
  extractWeight,
  extractDimensions,
  extractReleaseYear,
  extractRating,
} = require("../utils/attributeExtractor");

module.exports = async function scrapeHawkins() {
  console.log("\n🔥 HAWKINS SCRAPER");

  const products = await scrapeAmazon(
    "https://www.amazon.in/s?k=hawkins+pressure+cooker",
    "Hawkins"
  );

  const cleanedProducts = products.map((p) => {
    const title = p.title || "";

    return {
      title,

      brand: detectBrand(title) || "Hawkins",

      category: mapCategory(title), // Pressure Cooker, Kadai, etc (or null)

      releaseYear: extractReleaseYear(),

      material: detectMaterial(title),

      dimensions: extractDimensions(title),

      weight: extractWeight(title),

      heatCompatibility:
        title.toLowerCase().includes("induction")
          ? "Gas, Induction"
          : "Gas",

      durability: null, // manual later
      efficiency: null, // manual later
      specialFeatures: null, // manual later

      price: p.price ?? null, // RUPEES ONLY

      rating: extractRating(), // random 3–5 ⭐

      image: p.image || "",

      sourceUrl: p.sourceUrl || "",

      scrapedAt: new Date(),
    };
  });

  // ❗ Only remove products where category is STILL null
  const finalProducts = cleanedProducts.filter(
    (p) => p.category !== null
  );

  console.log(`✅ Hawkins: ${finalProducts.length} products ready`);

  return finalProducts;
};