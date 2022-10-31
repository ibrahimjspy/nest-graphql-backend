export const getTotalFromBundles = (bundles) => {
  let total = 0;
  (bundles || []).forEach((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    total += getTotalFromVariants(variants, quantity);
  });
  return total;
};

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

export const getFulfillmentTotal = (fulfillments) => {
  let total = 0;
  (fulfillments || []).forEach((fulfillment) => {
    total = getTotalFromBundles(fulfillment['fulfillmentBundles']);
  });
  return total;
};

export const getCurrency = (bundles) => {
  const firstBundle = bundles[0];
  const firstVariant = firstBundle[0];
  return firstVariant?.variant?.pricing?.price?.gross?.currency;
};

export const addStatusAndTotalToBundles = (bundles, status) => {
  return (bundles || []).map((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    const total = getTotalFromVariants(variants, quantity);
    return {
      ...bundles,
      totalAmount: total,
      fulfillmentStatus: status,
    };
  });
};

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
        totalAmount: total,
      };
    });
    return {
      ...fulfillment,
      totalAmount: getTotalFromBundles(fulfillment['fulfillmentBundles']),
    };
  });
};
