import { CheckoutBundleType } from './Checkout.utils.type';

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

/**
 * returns line items (for saleor apis)
 * @params bundles: all bundles array in the checkout
 * @params targetBundles: bundles array for which we need line items
 */
export const getLineItems = (bundles, targetBundles) => {
  const lines: Array<{ quantity: number; variantId: string }> = [];
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
 * @params lines: checkout lines from saleor checkout
 * @params checkoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart for which update (i.e quantity or color) is required
 */
export const getUpdatedLinesWithQuantity = (
  lines,
  checkoutBundles,
  bundlesFromCart,
) => {
  const quantity = bundlesFromCart[0]?.quantity;
  const checkoutBundleIds = bundlesFromCart.map((bundle) => bundle?.bundleId);

  const checkoutLines = getCheckoutLineItems(
    lines,
    checkoutBundles,
    checkoutBundleIds,
  );

  return (checkoutLines || []).map((line) => ({
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
 * @params lines: checkout lines from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 */
export const getCheckoutLineItems = (lines, bundles, bundleIds) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  const variantIds = getVariantIds(targetBundle);

  return (lines || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      variantId: line?.variant?.id,
      quantity: line?.quantity,
    }));
};

/**
 * returns line items array for saleor api
 * @params checkoutLines: checkout lines from saleor checkout
 * @returns array of checkoutLineIds
 */
export const getCheckoutLineIds = (checkoutLines = []) => {
  return checkoutLines.map((l: any) => l?.id || l?.variantId);
};

/**
 * returns bundle object with updated selection object and limited info (i.e bundleId, quantity, isSelected)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 * @params isSelected: flag to check if bundle is selected for checkout or not
 */
export const selectOrUnselectBundle = (
  bundles,
  bundleIds: Array<string>,
  isSelected: boolean,
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
export const updateBundlesQuantity = (allCheckoutBundles, bundlesFromCart) => {
  return bundlesFromCart.map((bundle) => {
    const targetBundle = allCheckoutBundles.find(
      (checkoutBundle) => checkoutBundle?.id === bundle?.id,
    );
    const oldQuantity = bundle?.quantity ? bundle.quantity : 0;
    const newQuantity = targetBundle?.quantity ? targetBundle.quantity : 0;
    return { ...bundle, quantity: oldQuantity + newQuantity };
  });
};

/**
 * returns available shipping methods from different shops
 * @params bundles: all the bundles array from the checkout data
 */
export const getShippingMethods = (bundles = []) => {
  let shippingMethods = [];
  bundles.forEach((bundle: CheckoutBundleType) => {
    shippingMethods = [
      ...shippingMethods,
      ...(bundle?.bundle?.shop?.shippingMethods || []),
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
export const getDummyGateway = (availablePaymentGateways = []) => {
  const dummyGateway = availablePaymentGateways.find(
    (gateway) => gateway?.name === 'Dummy',
  );
  return dummyGateway?.id;
};
