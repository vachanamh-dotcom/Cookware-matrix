// backend/normalize_cookware.js
require("dotenv").config();
const mongoose = require("mongoose");
const Cookware = require("./models/Cookware.js");

/* -----------------------------
   1) DB CONNECT
------------------------------ */

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/cookwareDB";

async function connectDB() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");
}

/* -----------------------------
   2) NORMALIZATION HELPERS
------------------------------ */

function guessCategory(title, existingCategory) {
  if (existingCategory && existingCategory.trim()) return existingCategory; // don't overwrite

  const t = (title || "").toLowerCase();

  if (t.includes("pressure") || t.includes("cooker")) return "Pressure Cooker";
  if (t.includes("fry") && t.includes("pan")) return "Fry Pan";
  if (t.includes("tawa") || t.includes("tava")) return "Tawa";
  if (t.includes("kadhai") || t.includes("kadai")) return "Kadai";
  if (t.includes("handi")) return "Handi";
  if (t.includes("sauce")) return "Sauce Pan";
  if (t.includes("biryani")) return "Biryani Pot";
  if (t.includes("idli")) return "Idli Cooker";
  if (t.includes("grill")) return "Grill Pan";
  if (t.includes("tadka")) return "Tadka Pan";

  return existingCategory || "Cookware";
}

function normalizeMaterialFromText(text, currentMaterial) {
  if (currentMaterial && currentMaterial.trim()) return currentMaterial;

  const t = (text || "").toLowerCase();

  if (t.includes("hard anod")) return "Hard Anodised Aluminum";
  if (t.includes("anodised") || t.includes("anodized")) return "Hard Anodised Aluminum";
  if (t.includes("alum")) return "Aluminum";
  if (t.includes("stainless") || t.includes("steel") || t.includes("ss"))
    return "Stainless Steel";
  if (t.includes("non stick") || t.includes("non-stick"))
    return "Non-Stick Coated Aluminum";

  return currentMaterial || null;
}

function extractSpecialFeaturesFromText(text, currentFeatures) {
  if (currentFeatures && currentFeatures.trim()) return currentFeatures;

  const t = (text || "").toLowerCase();
  const features = new Set();

  if (t.includes("hard anod")) features.add("Hard Anodised Coating");
  if (t.includes("non stick") || t.includes("non-stick"))
    features.add("Non-Stick Coating");
  if (t.includes("induction")) features.add("Induction Compatible");
  if (t.includes("gas")) features.add("Gas Stove Compatible");
  if (t.includes("futura")) features.add("Futura Series");
  if (t.includes("contura")) features.add("Contura Shape");
  if (t.includes("classic")) features.add("Classic Series");
  if (t.includes("svachh")) features.add("Spill Control (Svachh) Lid");

  if (!features.size) return currentFeatures || null;

  const combined = Array.from(features).join(", ");

  // If there were existing features, keep them too
  if (currentFeatures && currentFeatures.trim()) {
    return currentFeatures + ", " + combined;
  }

  return combined;
}

function normalizeDimensions(doc) {
  // If dimensions already present, don't touch
  if (doc.dimensions && doc.dimensions.trim()) return doc.dimensions;

  // If capacity exists in title like "3 Litre"
  const m = (doc.title || "").match(/(\d+(\.\d+)?)\s*(litre|ltr|l)\b/i);
  if (m) return `${m[1]} Litre`;

  return doc.dimensions || null;
}

/* -----------------------------
   3) MAIN NORMALIZATION TASK
------------------------------ */

async function normalizeCookware() {
  await connectDB();

  // Filter: only Hawkins + Prestige for now (you can add more brands later)
  const docs = await Cookware.find({
    brand: { $in: ["Hawkins", "Prestige"] },
  });

  console.log(`\n🛠 Normalizing ${docs.length} cookware items...\n`);

  let updatedCount = 0;

  for (const doc of docs) {
    let changed = false;

    const original = doc.toObject();

    // Use both title + rawDescription (if you add later)
    const textBlob = `${doc.title || ""} ${doc.specialFeatures || ""} ${
      doc.material || ""
    }`;

    // Category
    const newCategory = guessCategory(doc.title, doc.category);
    if (newCategory !== doc.category) {
      doc.category = newCategory;
      changed = true;
    }

    // Material
    const newMaterial = normalizeMaterialFromText(textBlob, doc.material);
    if (newMaterial !== doc.material) {
      doc.material = newMaterial;
      changed = true;
    }

    // Special Features
    const newFeatures = extractSpecialFeaturesFromText(textBlob, doc.specialFeatures);
    if (newFeatures !== doc.specialFeatures) {
      doc.specialFeatures = newFeatures;
      changed = true;
    }

    // Dimensions (capacity)
    const newDimensions = normalizeDimensions(doc);
    if (newDimensions !== doc.dimensions) {
      doc.dimensions = newDimensions;
      changed = true;
    }

    // VERY IMPORTANT: we DO NOT touch any non-null durability/efficiency etc.
    // You can add smarter inference here later if you want.

    if (changed) {
      await doc.save();
      updatedCount++;

      console.log(
        `   🔧 Updated [${doc.brand}] ${original.title} → category="${doc.category}", material="${doc.material}", dimensions="${doc.dimensions}", features="${doc.specialFeatures}"`
      );
    }
  }

  console.log(`\n✅ Normalization complete. Updated ${updatedCount} products.\n`);

  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed.\n");
}

/* -----------------------------
   4) RUN
------------------------------ */

normalizeCookware().catch((err) => {
  console.error("❌ Normalization error:", err);
  mongoose.connection.close();
});
