// utils/brandDetector.js

const BRANDS = [
  "Prestige",
  "Hawkins",
  "Pigeon",
  "Meyer",
  "Butterfly"
];

function detectBrand(title = "") {
  const lower = title.toLowerCase();

  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  return null;
}

module.exports = detectBrand;
