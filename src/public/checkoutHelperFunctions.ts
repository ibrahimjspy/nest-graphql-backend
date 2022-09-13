export const getLineItems = (allBundles, targetBundles) => {
  const lines = [];
  allBundles.forEach((bundle) => {
    const targetBundle = (targetBundles || []).find(
      (a) => a?.bundleId === bundle?.id,
    );

    // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = targetBundle?.quantity;
    bundle?.variants?.forEach((v) =>
      lines.push({
        quantity: bundleQty * v?.quantity,
        variantId: v?.variant?.id,
      }),
    );
  });
  return lines;
};

export const getUpdatedLinesWithQuantity = (lineItems, quantity) => {
  return lineItems.map((line) => ({
    variantId: line?.variant?.id,
    quantity: line?.quantity * quantity,
  }));
};

export const getTargetBundle = (bundles, bundleId) => {
  if (Array.isArray(bundleId)) {
    return (bundles || []).filter((bundle) =>
      bundleId.includes(bundle?.checkoutBundleId),
    );
  } else {
    return (bundles || []).filter(
      (bundle) => bundleId === bundle?.checkoutBundleId,
    );
  }
};

export const getTargetBundleByBundleId = (bundles, bundleId) => {
  if (Array.isArray(bundleId)) {
    return (bundles || []).filter((bundle) => {
      return bundleId.includes(bundle?.bundle?.id);
    });
  } else {
    return (bundles || []).filter((bundle) => bundleId === bundle?.bundle?.id);
  }
};

export const getVariantIds = (targetBundle) => {
  const variantIds = [];
  targetBundle.forEach((bundlesObj) => {
    bundlesObj?.bundle?.variants.forEach((variant) =>
      variantIds.push(variant?.variant?.id),
    );
  });
  return variantIds;
};

export const getTargetLineIds = (saleorCheckout, variantIds) => {
  const lineItems = saleorCheckout?.checkout?.lines;
  return (lineItems || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      variantId: line?.variant?.id,
      quantity: line?.quantity,
    }));
};

export const updateBundlesQuantity = (allCheckoutBundles, bundles) => {
  return bundles.map((bundle) => {
    const targetBundle = allCheckoutBundles.find(
      (checkoutBundle) => checkoutBundle?.id === bundle?.id,
    );
    return { ...bundle, quantity: bundle?.quantity + targetBundle?.quantity };
  });
};
