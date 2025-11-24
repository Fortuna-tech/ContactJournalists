export const CATEGORY_INPUT_PATTERN = /^[A-Za-z0-9 ]+$/;

export const normalizeCategoryId = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_");
};

export const sanitizeCategoryTitle = (title: string) => {
  return title.trim().replace(/\s+/g, " ");
};
