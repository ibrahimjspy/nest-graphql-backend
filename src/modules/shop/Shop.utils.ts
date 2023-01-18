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

/**
* returns with fields array
* @params shop: information for shop creation
*/
export const validateStoreInput = (storeInput) => {
 return {
   ...storeInput,
   user: storeInput["email"],
   description: storeInput["description"] || "",
   about: storeInput["about"] || "",
   madeIn: storeInput["madeIn"] || "",
   minOrder: storeInput["minOrder"] || 0,
   returnPolicy: storeInput["returnPolicy"] || "",
   storePolicy: storeInput["storePolicy"] || "",
   logo: storeInput["logo"] || "",
   banner: storeInput["banner"] || "",
   facebook: storeInput["facebook"] || "",
   pinterest: storeInput["pinterest"] || "",
   instagram: storeInput["instagram"] || "",
   twitter: storeInput["twitter"] || ""
 };
};
