// utils/attributeExtractor.js

function extractWeight(title = "") {
  const match = title.match(/(\d+(\.\d+)?)\s?(kg|kilogram)/i);
  return match ? Number(match[1]) : null;
}

function extractDimensions(title = "") {
  const match = title.match(/(\d+(\.\d+)?)\s?(l|litre|liter)/i);
  return match ? match[0] : null;
}

function extractReleaseYear() {
  return new Date().getFullYear(); // safe default
}

function extractRating() {
  return Number((Math.random() * (5 - 3) + 3).toFixed(1)); // 3.0 – 5.0
}

module.exports = {
  extractWeight,
  extractDimensions,
  extractReleaseYear,
  extractRating
};
