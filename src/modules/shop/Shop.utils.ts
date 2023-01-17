/**
 * validates whether an input is an array, if not return an array with single element
 */
export const validateArray = (input) => {
  return input.map ? input : Array(input);
};

/**
 * take shop fields and returns storefront ids in an array
 */
export const getStoreFrontFieldValues = (fields) => {
  let storefrontIds = [];
  if (fields.map) {
    fields.map((field) => {
      if (field.name == 'storefrontids') {
        storefrontIds = field.values;
      }
    });
  }
  return storefrontIds;
};

/**
 * parses product variant array from shop and returns an array with variant ids
 */
export const getProductVariantIds = (variantsInput) => {
  const variantIds = [];
  (variantsInput || []).map((variant) => {
    variantIds.push(variant.id);
  });
  return variantIds;
};
