/**
 * It takes an array of checkoutBundles and returns an array of product ids
 * @param {any[]} checkoutBundles - any[]
 * @returns An array of product ids from the checkoutBundles
 */
export const getProductIdsByCheckoutBundles = (
  checkoutBundles: any[],
): Array<string> => {
  return checkoutBundles?.reduce((result, bundle) => {
    const variants = bundle['bundle']?.variants;
    if (variants?.length) result.push(variants[0]?.variant?.product?.id);
    return result;
  }, []);
};

/**
 * It takes a list of products and returns a list of all the variants ids
 * @param products - The products object returned from the query.
 * @returns An array of variant ids
 */
export const getVariantsIdsByProducts = (products) => {
  return products?.edges?.reduce((result, product) => {
    const variants: Array<{ id: string }> = product?.node?.variants;
    variants.reduce((_, currValue) => result.push(currValue?.id));
    return result;
  }, []);
};

/**
 * It takes an array of checkout bundles and returns an array of bundle ids
 * @param {any[]} checkoutBundles - any[]
 * @returns An array of strings
 */
export const getCheckoutBundlesIds = (
  checkoutBundles: any[],
): Array<string> => {
  return checkoutBundles?.map((bundle) => bundle['bundle']?.id);
};

/**
 * It takes an array of checkoutBundles and an array of allBundles and returns an array of allBundles
 * that are not in checkoutBundles
 * @param checkoutBundles - Array<any>
 * @param allBundles - Array<any> - this is the list of all bundles that are available to be added to
 * the cart.
 * @returns An array of objects with the following properties:
 *   checkoutBundleId: string
 *   isSelected: boolean
 *   quantity: number
 *   in_checkout: boolean
 *   bundle: object
 */
export const getBundlesNotInCheckout = (
  checkoutBundles: Array<any>,
  allBundles: Array<any>,
): Array<any> => {
  if (checkoutBundles.length == 0) return [];
  const checkoutBundlesIds = getCheckoutBundlesIds(checkoutBundles);

  return allBundles?.reduce((result, bundle: { id: string }) => {
    if (!checkoutBundlesIds.includes(bundle.id)) {
      result.push({
        checkoutBundleId: '',
        isSelected: false,
        quantity: 0,
        bundle,
      });
    }
    return result;
  }, []);
};
