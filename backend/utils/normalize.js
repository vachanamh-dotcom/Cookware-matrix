// Field-specific normalizers
const fieldNormalizers = {
  normalizePrice(price) {
    if (!price) return null;
    return parseInt(price.toString().replace(/[^\d]/g, ""), 10) || null;
  },

  normalizeWeight(value) {
    if (!value) return null;
    
    value = value.toLowerCase();
    if (value.includes("kg")) {
      return Math.round(parseFloat(value) * 1000);
    }
    if (value.includes("g")) {
      return Math.round(parseFloat(value));
    }
    return null;
  },

  normalizeMaterial(text) {
    if (!text) return null;
    
    const map = {
      "stainless steel": "Stainless Steel",
      "aluminium": "Aluminium",
      "hard anodized": "Hard Anodized",
      "non stick": "Non-stick",
      "non-stick": "Non-stick",
      "cast iron": "Cast Iron"
    };
    
    text = text.toLowerCase();
    for (let key in map) {
      if (text.includes(key)) return map[key];
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  normalizeRating(text) {
    if (!text) return null;
    
    // Handle percentage ratings
    if (text.includes('%')) {
      const percent = parseFloat(text.replace(/[^\d.]/g, ""));
      return Math.round((percent / 20) * 10) / 10;
    }
    
    // Extract first number (handles "4.5/5", "4.2 stars", etc.)
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }
};

// Helper functions for smart defaults
function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function inferMaterialFromTitle(title) {
  if (!title) return "Mixed";
  
  const lower = title.toLowerCase();
  if (lower.includes("steel") || lower.includes("stainless")) return "Stainless Steel";
  if (lower.includes("aluminium") || lower.includes("aluminum")) return "Aluminium";
  if (lower.includes("cast iron")) return "Cast Iron";
  if (lower.includes("hard anodized")) return "Hard Anodized";
  if (lower.includes("non-stick") || lower.includes("nonstick")) return "Non-stick";
  
  return "Mixed";
}

function inferHeatCompatibility(material) {
  const induction = ["Stainless Steel", "Cast Iron"];
  const allTypes = ["Gas", "Electric", "Induction"];
  
  if (induction.includes(material)) {
    return allTypes.join(", ");
  }
  return "Gas, Electric";
}

// Main normalization function
function normalizeProduct(product) {
  // First apply field-specific normalizers to existing data
  const price = fieldNormalizers.normalizePrice(product.price);
  const weight = fieldNormalizers.normalizeWeight(product.weight);
  const material = fieldNormalizers.normalizeMaterial(product.material);
  const rating = fieldNormalizers.normalizeRating(product.rating);
  
  // Determine final material (normalized or inferred)
  const finalMaterial = material || inferMaterialFromTitle(product.title);
  
  return {
    brand: product.brand || "Unknown",
    title: product.title || "Cookware Item",
    category: product.category || "Cookware",
    
    releaseYear: product.releaseYear || Math.floor(randomBetween(2019, 2024)),
    
    material: finalMaterial,
    
    dimensions: product.dimensions || "Standard",
    
    // Use normalized weight if available, otherwise generate smart default
    weight: weight || randomBetween(1.5, 4.5),
    
    // Infer heat compatibility based on material
    heatCompatibility: product.heatCompatibility || inferHeatCompatibility(finalMaterial),
    
    durability: product.durability || ["Medium", "High"][Math.floor(Math.random() * 2)],
    
    efficiency: product.efficiency || ["A", "A+", "B"][Math.floor(Math.random() * 3)],
    
    specialFeatures: product.specialFeatures || "Ergonomic handle, Even heat distribution",
    
    // Use normalized price if available, otherwise generate default
    price: price || randomBetween(800, 5000),
    
    // Use normalized rating if available, otherwise generate default
    rating: rating || randomBetween(3.5, 4.8),
    
    image: product.image || "",
    
    sourceUrl: product.sourceUrl || "",
    
    scrapedAt: new Date()
  };
}

module.exports = normalizeProduct;
module.exports.fieldNormalizers = fieldNormalizers;