const mongoose = require("mongoose");

const comparisonSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product1: { type: mongoose.Schema.Types.ObjectId, ref: "Cookware", required: true },
    product2: { type: mongoose.Schema.Types.ObjectId, ref: "Cookware", required: true },
    category: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comparison", comparisonSchema);