// routes/comparisons.js
const express = require("express");
const router = express.Router();
const Comparison = require("../models/Comparison");
const Cookware = require("../models/Cookware");

// Save a new comparison
router.post("/", async (req, res) => {
  try {
    const { userId, product1Id, product2Id, category } = req.body;

    // Validate that products exist
    const product1 = await Cookware.findById(product1Id);
    const product2 = await Cookware.findById(product2Id);

    if (!product1 || !product2) {
      return res.status(404).json({ message: "One or both products not found" });
    }

    // Check if comparison already exists
    const existingComparison = await Comparison.findOne({
      user: userId,
      $or: [
        { product1: product1Id, product2: product2Id },
        { product1: product2Id, product2: product1Id }
      ]
    });

    if (existingComparison) {
      return res.status(400).json({ message: "This comparison already exists" });
    }

    // Create new comparison
    const comparison = new Comparison({
      user: userId,
      product1: product1Id,
      product2: product2Id,
      category: category || "General"
    });

    await comparison.save();

    // Populate the products before sending response
    await comparison.populate("product1 product2");

    res.status(201).json({
      message: "Comparison saved successfully",
      comparison
    });
  } catch (error) {
    console.error("Error saving comparison:", error);
    res.status(500).json({ message: "Failed to save comparison", error: error.message });
  }
});

// Get all comparisons for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const comparisons = await Comparison.find({ user: userId })
      .populate("product1 product2")
      .sort({ createdAt: -1 });

    res.json(comparisons);
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    res.status(500).json({ message: "Failed to fetch comparisons", error: error.message });
  }
});

// Delete a comparison
router.delete("/:comparisonId", async (req, res) => {
  try {
    const { comparisonId } = req.params;

    const comparison = await Comparison.findByIdAndDelete(comparisonId);

    if (!comparison) {
      return res.status(404).json({ message: "Comparison not found" });
    }

    res.json({ message: "Comparison deleted successfully" });
  } catch (error) {
    console.error("Error deleting comparison:", error);
    res.status(500).json({ message: "Failed to delete comparison", error: error.message });
  }
});

// Get comparison count for a user
router.get("/user/:userId/count", async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Comparison.countDocuments({ user: userId });
    res.json({ count });
  } catch (error) {
    console.error("Error counting comparisons:", error);
    res.status(500).json({ message: "Failed to count comparisons", error: error.message });
  }
});

module.exports = router;