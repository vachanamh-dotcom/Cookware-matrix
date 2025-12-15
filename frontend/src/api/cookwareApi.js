const BASE_URL = "http://localhost:5000/api/cookware";

export const fetchCookware = async (params = "") => {
  const res = await fetch(`${BASE_URL}${params}`);
  return res.json();
};

export const searchCookware = async (q) => {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);
  return res.json();
};

export const compareCookware = async (brand1, brand2, category) => {
  const res = await fetch(
    `${BASE_URL}/compare?brand1=${brand1}&brand2=${brand2}&category=${category}`
  );
  return res.json();
};