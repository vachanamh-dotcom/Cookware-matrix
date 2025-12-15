export const formatPrice = (price) => {
  if (!price || isNaN(price)) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

export const getImage = (image) => {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  return image;
};
