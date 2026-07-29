export const getProductImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${import.meta.env.VITE_BACK_END_URL}/images/${image}`;
};
