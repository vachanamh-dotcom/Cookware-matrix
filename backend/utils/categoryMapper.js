// utils/categoryMapper.js

const CATEGORY_KEYWORDS = {
  "Pressure Cooker": ["pressure cooker", "outer lid", "inner lid", "cooker"],
  "Fry Pan": ["fry pan", "frying pan", "skillet", "omelette"],
  "Sauce Pan": ["sauce pan", "saucepan", "milk pan", "tea pan"],
  "Kadai": ["kadai", "kadhai", "wok"],
  "Dosa Tawa": ["dosa tawa", "tawa", "roti tawa", "chapati tawa"],
  "Paddu": ["paddu", "paniyaram", "appe", "appam"]
};

function mapCategory(title = "") {
  const lower = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      return category;
    }
  }

  return "Cookware"; // allowed
}

module.exports = mapCategory;
