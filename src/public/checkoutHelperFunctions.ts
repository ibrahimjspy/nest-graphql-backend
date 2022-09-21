export const getBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.bundleId);
};

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

export const getUpdatedLinesWithQuantity = (
  saleorCheckout,
  checkoutBundles,
  bundlesFromCart,
) => {
  const quantity = bundlesFromCart[0]?.quantity;
  const checkoutBundleIds = bundlesFromCart.map((bundle) => bundle?.bundleId);

  const targetLineItems = getTargetLineIds(
    saleorCheckout,
    checkoutBundles,
    checkoutBundleIds,
  );

  return (targetLineItems || []).map((line) => ({
    variantId: line?.variantId,
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

export const getSelectedLineItems = (saleorCheckout, bundles, bundleIds) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  const variantIds = getVariantIds(targetBundle);

  const lineItems = saleorCheckout?.checkout?.lines;
  return (lineItems || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      variantId: line?.variant?.id,
      quantity: line?.quantity,
    }));
};

export const getTargetLineIds = (saleorCheckout, bundles, bundleIds) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  const variantIds = getVariantIds(targetBundle);

  const lineItems = saleorCheckout?.checkout?.lines;
  return (lineItems || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      variantId: line?.variant?.id,
      quantity: line?.quantity,
    }));
};

export const getUpdatedBundleForSelection = (
  bundles,
  bundleIds,
  isSelected,
) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  return (targetBundle || []).map((bundle) => ({
    bundleId: bundle?.bundle?.id,
    quantity: bundle?.quantity,
    isSelected,
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

export const getShippingMethods = (bundles = []) => {
  let shippingMethods = [];
  bundles.forEach((bundle) => {
    shippingMethods = [
      ...shippingMethods,
      ...bundle?.bundle?.shop?.shippingMethods,
    ];
  });
  return shippingMethods;
};

export const getShippingMethodsWithUUID = (
  methods,
  shippingMethodsFromShopService,
  selectedMethods,
) => {
  const selectedMethodsId = selectedMethods.map(
    (shippingMethod) => shippingMethod?.method?.shippingMethodId,
  );
  const getUUID = (id) => {
    const sameMethod = (shippingMethodsFromShopService || []).find(
      (method) => method?.shippingMethodId === id,
    );
    return sameMethod?.id;
  };

  return (methods || []).map((method) => {
    const shippingMethodId = getUUID(method?.id);
    if (selectedMethodsId.includes(method?.id)) {
      return {
        ...method,
        shippingMethodId,
        isSelected: true,
      };
    } else {
      return {
        ...method,
        shippingMethodId,
        isSelected: false,
      };
    }
  });
};

export const getSelectedBundles = (bundles) => {
  return bundles.filter((bundle) => bundle?.isSelected);
};

export const getCheckoutBundleIds = (bundles) => {
  return bundles.map((bundle) => bundle?.checkoutBundleId);
};

export const getDummyGateway = (paymentGateways) => {
  const options = paymentGateways?.checkout?.availablePaymentGateways || [];
  const dummyGateway = options.find((gateway) => gateway?.name === 'Dummy');
  return dummyGateway?.id;
};
