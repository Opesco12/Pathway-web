export const toSnakeCase = (str) => {
  return str
    ?.trim()
    ?.toLowerCase()
    ?.replace(/\s+/g, "_")
    ?.replace(/[^a-z0-9_]/g, "");
};

export const getProductImage = (productName) => {
  const products = [
    "pathway_money_market_note",
    "pathway_fixed_income_note",
    "pathway_fixed_deposit_note",
    "pathway_dollar_note",
    "pathway_hybrid_note",
  ];
  if (products.includes(toSnakeCase(productName))) {
    return `https://res.cloudinary.com/dtu6cxvk6/image/upload/${toSnakeCase(
      productName,
    )}.png`;
  } else {
    return `https://res.cloudinary.com/dtu6cxvk6/image/upload/default.png`;
  }
};
