/**
 * returns array of bundle ids
 * @params bundles: array with full bundle objects
 */
 export const getBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.bundleId);
};

/**
 * returns line items (for saleor apis)
 * @params bundles: all bundles array in the checkout
 * @params targetBundles: bundles array for which we need line items
 */
export const getLineItems = (bundles, targetBundles) => {
  const lines = [];
  bundles.forEach((bundle) => {
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

/**
 * returns line items with updated quantity
 * @params saleorCheckout: complete checkout object from saleor checkout
 * @params checkoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart for which update (i.e quantity or color) is required
 */
export const getUpdatedLinesWithQuantity = (
  saleorCheckout,
  checkoutBundles,
  bundlesFromCart,
) => {
  const quantity = bundlesFromCart[0]?.quantity;
  const checkoutBundleIds = bundlesFromCart.map((bundle) => bundle?.bundleId);

  const targetLineItems = getTargetLineItems(
    saleorCheckout,
    checkoutBundles,
    checkoutBundleIds,
  );

  return (targetLineItems || []).map((line) => ({
    variantId: line?.variantId,
    quantity: line?.quantity * quantity,
  }));
};

/**
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleId: bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByBundleId = (bundles, bundleId) => {
  if (Array.isArray(bundleId)) {
    return (bundles || []).filter((bundle) => {
      return bundleId.includes(bundle?.bundle?.id);
    });
  } else {
    return (bundles || []).filter((bundle) => bundleId === bundle?.bundle?.id);
  }
};

/**
 * returns array of variant ids from the target bundles
 * @params targetBundles: complete arget bundles array consisting of variants info
 */
export const getVariantIds = (targetBundles) => {
  const variantIds = [];
  (targetBundles || []).forEach((bundlesObj) => {
    bundlesObj?.bundle?.variants.forEach((variant) =>
      variantIds.push(variant?.variant?.id),
    );
  });
  return variantIds;
};

/**
 * returns line items array for saleor api
 * @params saleorCheckout: complete checkout object from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 */
export const getTargetLineItems = (saleorCheckout, bundles, bundleIds) => {
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

/**
 * returns bundle object with updated selection object and limited info (i.e bundleId, quantity, isSelected)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 * @params isSelected: flag to check if bundle is selected for checkout or not
 */
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

/**
 * returns already added bundles in cart with updated quantity
 * @params allCheckoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart which are again added to cart
 */
export const updateBundlesQuantity = (allCheckoutBundles, bundles) => {
  return bundles.map((bundle) => {
    const targetBundle = allCheckoutBundles.find(
      (checkoutBundle) => checkoutBundle?.id === bundle?.id,
    );
    return { ...bundle, quantity: bundle?.quantity + targetBundle?.quantity };
  });
};

/**
 * returns available shipping methods from different shops
 * @params bundles: all the bundles array from the checkout data
 */
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

/**
 * returns shipping methods from shop service mapped with shipping methods from saleor api
 * @params methods: shipping methods from saleor
 * @params shippingMethodsFromShopService: shipping methods from shop service
 * @params selectedMethods: shipping method ids selected by user
 */
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

/**
 * returns selected bundles from all bundles list
 * @params bundles: all the bundles array from the checkout data
 */
export const getSelectedBundles = (bundles) => {
  return bundles.filter((bundle) => bundle?.isSelected);
};

/**
 * returns array of checkoutBundleIds from bundles list (bundleId is different from checkoutBundleId)
 * @params bundles: all the bundles array from the checkout data
 */
export const getCheckoutBundleIds = (bundles) => {
  return bundles.map((bundle) => bundle?.checkoutBundleId);
};

/**
 * returns dummy payment gateway for testing purpose
 * @params paymentGateways: available payment gateways
 */
export const getDummyGateway = (paymentGateways) => {
  const options = paymentGateways?.checkout?.availablePaymentGateways || [];
  const dummyGateway = options.find((gateway) => gateway?.name === 'Dummy');
  return dummyGateway?.id;
};
