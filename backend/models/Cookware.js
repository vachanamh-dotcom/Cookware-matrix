const mongoose = require("mongoose");

const cookwareSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: String,
  category: String,
  releaseYear: Number,
  material: String,
  dimensions: String,
  weight: Number,
  heatCompatibility: String,
  durability: String,
  efficiency: String,
  specialFeatures: String,
  price: {
    type: Number, // RUPEES ONLY
    required: false
  },
  rating: Number,
  image: {
    type: String,
    default: ""
  },
  sourceUrl: String,
  scrapedAt: { type: Date, default: Date.now }
});

// Ensure no duplicate product/brand combo
cookwareSchema.index({ title: 1, brand: 1 }, { unique: true });

module.exports = mongoose.model("Cookware", cookwareSchema);