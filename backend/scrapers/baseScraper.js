const axios = require("axios");
const cheerio = require("cheerio");
const mapCategory = require("../utils/categoryMapper");

async function scrapeAmazon(searchUrl, brand) {
  const { data } = await axios.get(searchUrl, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  const products = [];

  $(".s-result-item").each((_, el) => {
    const title = $(el).find("h2 span").text();
    const priceText = $(el).find(".a-price-whole").first().text();
    const image = $(el).find("img").attr("src");
    const sourceUrl = $(el).find("h2 a").attr("href");

    if (!title || !priceText) return;

    // Use categoryMapper utility instead of hardcoded logic
    const category = mapCategory(title);

    products.push({
      title,
      brand,
      category, // Can be null - let individual scrapers handle it
      price: parseInt(priceText.replace(/,/g, ""), 10) || null,
      image: image || "",
      sourceUrl: sourceUrl ? `https://www.amazon.in${sourceUrl}` : "",
      rating: (Math.random() * 2 + 3).toFixed(1) // ⭐ random 3–5
    });
  });

  return products;
}

module.exports = scrapeAmazon;