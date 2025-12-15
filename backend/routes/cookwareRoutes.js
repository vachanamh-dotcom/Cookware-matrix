const express = require("express");
const router = express.Router();
const Cookware = require("../models/Cookware");

// --------------------------------------------------
// ALLOWED CATEGORIES
// --------------------------------------------------
const ALLOWED_CATEGORIES = [
  "Pressure Cooker",
  "Frying Pan",
  "Sauce Pan",
  "Kadai",
  "Dosa Tawa",
  "Paddu Pan"
];

// --------------------------------------------------
// HELPER: Normalize and validate category
// --------------------------------------------------
const normalizeCategory = (category) => {
  if (!category) return null;
  
  // Trim and normalize the category string
  const normalized = category.trim();
  
  // Check if it matches any allowed category (case-insensitive)
  const match = ALLOWED_CATEGORIES.find(
    allowed => allowed.toLowerCase() === normalized.toLowerCase()
  );
  
  return match || null; // Return exact match or null
};

// --------------------------------------------------
// GET ALL COOKWARE (with filters)
// /api/cookware?brand=Prestige&category=Fry Pan&search=fry
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { brand, category, search } = req.query;
    const filter = {};

    if (brand) filter.brand = brand;
    
    if (category) {
      filter.category = category;
    } else {
      filter.category = { $in: ALLOWED_CATEGORIES };
    }
    
    if (search) filter.title = { $regex: search, $options: "i" };

    const products = await Cookware.find(filter).limit(300);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// COMPARE PRODUCTS
// /api/cookware/compare?brand1=Prestige&brand2=Hawkins&category=Pressure Cooker
// --------------------------------------------------
router.get("/compare", async (req, res) => {
  try {
    const { brand1, brand2, category } = req.query;

    if (!brand1 || !brand2 || !category) {
      return res.status(400).json({
        message: "brand1, brand2, and category are required",
      });
    }

    const products = await Cookware.find({
      category,
      brand: { $in: [brand1, brand2] },
    }).limit(2);

    if (products.length < 2) {
      return res.status(404).json({
        message: "Not enough products found for comparison",
      });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// SEARCH
// /api/cookware/search?q=fry
// --------------------------------------------------
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query 'q' required" });
    }

    const results = await Cookware.find({
      title: { $regex: q, $options: "i" },
      category: { $in: ALLOWED_CATEGORIES } // Only search in allowed categories
    }).limit(100);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// TRENDING PRODUCTS
// /api/cookware/trending
// --------------------------------------------------
router.get("/trending", async (req, res) => {
  try {
    const products = await Cookware.find({
      rating: { $gte: 4 },
      category: { $in: ALLOWED_CATEGORIES } // Only from allowed categories
    })
      .sort({
        rating: -1,
        views: -1,
        createdAt: -1
      })
      .limit(4);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// CREATE/INSERT NEW PRODUCT (with category validation)
// POST /api/cookware
// --------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    
    // Normalize and validate category
    const validCategory = normalizeCategory(productData.category);
    
    if (!validCategory) {
      return res.status(400).json({
        message: "Invalid category. Must be one of: " + ALLOWED_CATEGORIES.join(", "),
        providedCategory: productData.category
      });
    }
    
    // Update with normalized category
    productData.category = validCategory;
    
    // Create new product
    const product = new Cookware(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// UPDATE PRODUCT (with category validation)
// PUT /api/cookware/:id
// --------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updateData = req.body;
    
    // If category is being updated, validate it
    if (updateData.category) {
      const validCategory = normalizeCategory(updateData.category);
      
      if (!validCategory) {
        return res.status(400).json({
          message: "Invalid category. Must be one of: " + ALLOWED_CATEGORIES.join(", "),
          providedCategory: updateData.category
        });
      }
      
      updateData.category = validCategory;
    }
    
    const product = await Cookware.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Cookware not found" });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// BULK NORMALIZE CATEGORIES (cleanup utility)
// POST /api/cookware/normalize-categories
// --------------------------------------------------
router.post("/normalize-categories", async (req, res) => {
  try {
    const products = await Cookware.find({});
    let updated = 0;
    let removed = 0;
    
    for (const product of products) {
      const normalized = normalizeCategory(product.category);
      
      if (!normalized) {
        // Invalid category - optionally delete or mark for review
        await Cookware.findByIdAndDelete(product._id);
        removed++;
      } else if (normalized !== product.category) {
        // Update to normalized version
        product.category = normalized;
        await product.save();
        updated++;
      }
    }
    
    res.json({
      message: "Category normalization complete",
      updated,
      removed,
      total: products.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// GET SINGLE PRODUCT BY ID (KEEP LAST)
// --------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Cookware.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Cookware not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;