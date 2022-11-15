import { roundNumber } from 'src/core/utils/helpers';

/**
 * It takes a list of bundles and returns a total price of all the bundles
 * @param bundles - The bundles array returned from the query.
 * @returns total price
 */
export const getTotalFromBundles = (bundles) => {
  let total = 0;
  (bundles || []).forEach((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    total += getTotalFromVariants(variants, quantity);
  });
  return roundNumber(total);
};

/**
 * It takes a list of variants from a bundle and bundle quantity and returns a total price of all the variants in the bundle
 * @param variants - The variants array from a bundle.
 * @param quantity - quantity of the bundle.
 * @returns total price
 */
export const getTotalFromVariants = (variants, quantity) => {
  return (variants || []).reduce(
    (prev, curr) =>
      prev +
      parseFloat(curr?.variant?.pricing?.price?.gross?.amount) *
        parseInt(curr?.quantity) *
        parseInt(quantity),
    0,
  );
};

/**
 * It takes a list of fulfillments from an order and returns total price of bundles in the fulfillment
 * @param fulfillments - The fulfillments array from an order.
 * @returns total price
 */
export const getFulfillmentTotal = (fulfillments) => {
  let total = 0;
  (fulfillments || []).forEach((fulfillment) => {
    total = getTotalFromBundles(fulfillment['fulfillmentBundles']);
  });
  return roundNumber(total);
};

/**
 * It takes a list of bundles and returns a total price of all the bundles
 * @param bundles - The bundles array returned from the query.
 * @returns currency
 */
export const getCurrency = (bundles = []) => {
  const firstBundle = bundles[0];
  const firstVariant = (firstBundle?.bundle?.variants || [])[0];
  return firstVariant?.variant?.pricing?.price?.gross?.currency;
};

/**
 * It takes a list of order bundles and fulfillment status of the order
 * @param bundles - The bundles array returned from the query.
 * @param status - fulfillment status.
 * @returns An array of objects (bundles) with the all the bundle attributes including following properties:
 *   totalAmount: number
 *   fulfillmentStatus: string
 */
export const addStatusAndTotalToBundles = (bundles, status) => {
  return (bundles || []).map((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    const total = getTotalFromVariants(variants, quantity);
    return {
      ...bundleData,
      totalAmount: roundNumber(total),
      fulfillmentStatus: status,
    };
  });
};

/**
 * It takes a list of fulfillments and fulfillment status of the order
 * @param fulfillments - The fulfillments array returned from the query.
 * @param status - fulfillment status.
 * @returns An array of objects (bundles) with the all the fulfillmentBundle attributes including following properties:
 *   totalAmount: number
 *   fulfillmentStatus: string
 */
export const getFulFillmentsWithStatusAndBundlesTotal = (
  fulfillments,
  status,
) => {
  return (fulfillments || []).map((fulfillment) => {
    (fulfillment?.fulfillmentBundles || []).map((fulfillmentBundle) => {
      const variants = fulfillmentBundle?.bundle?.variants;
      const quantity = fulfillmentBundle?.quantity;
      const total = getTotalFromVariants(variants, quantity);
      return {
        ...fulfillmentBundle,
        fulfillmentStatus: status,
        totalAmount: roundNumber(total),
      };
    });
    return {
      ...fulfillment,
      totalAmount: getTotalFromBundles(fulfillment['fulfillmentBundles']),
    };
  });
};
