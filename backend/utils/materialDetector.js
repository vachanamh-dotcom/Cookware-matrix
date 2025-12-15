// utils/materialDetector.js

function detectMaterial(title = "") {
  const t = title.toLowerCase();

  if (t.includes("stainless steel")) return "Stainless Steel";
  if (t.includes("cast iron")) return "Cast Iron";
  if (t.includes("hard anodized")) return "Hard Anodized";
  if (t.includes("non stick") || t.includes("non-stick")) return "Non-Stick";
  if (t.includes("aluminium") || t.includes("aluminum")) return "Aluminium";
  if (t.includes("ceramic")) return "Ceramic";

  return null;
}

module.exports = detectMaterial;
