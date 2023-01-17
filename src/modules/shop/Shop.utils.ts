/**
 * validates whether an input is an array, if not return an array with single element
 */
export const validateArray = (input) => {
  return input.map ? input : Array(input);
};

/**
 * returns with fields array
 * @params shop: information for shop creation
 */
export const validateShopInput = (shop) => {
  return {
    ...shop,
    user: shop["email"],
    description: shop["description"] || "",
    about: shop["about"] || "",
    madeIn: shop["madeIn"] || "",
    minOrder: shop["minOrder"] || 0,
    returnPolicy: shop["returnPolicy"] || "",
    storePolicy: shop["storePolicy"] || "",
    logo: shop["logo"] || "",
    banner: shop["banner"] || "",
    facebookUrl: shop["facebookUrl"] || "",
    pinterestUrl: shop["pinterestUrl"] || "",
    instagramUrl: shop["instagramUrl"] || "",
    twitterUrl: shop["twitterUrl"] || ""
  };
};