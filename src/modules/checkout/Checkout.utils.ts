import { hash, makeQuantity } from 'src/core/utils/helpers';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';
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
export const getLineItems = async (bundles, targetBundles) => {
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

export const CreateLineItemsForSaleor = async (bundles) => {
  const lines: Array<{ quantity: number; variantId: string }> = [];
  bundles.forEach((bundle) => {
    // // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = bundle?.quantity;
    bundle.bundle?.productVariants?.forEach((v) =>
      lines.push({
        quantity: bundleQty * v?.quantity,
        variantId: v?.productVariant?.id,
      }),
    );
  });
  return lines;
};

export const getBundleIds = async (
  bundlesForCart: CheckoutBundleInputType[],
) => {
  return bundlesForCart.map((res) => res['bundleId']);
};
export const getIsExtingBundle = async (
  bundlesForCart: CheckoutBundleInputType[],
  validateBundleList: [],
) => {
  const updatebundles = [];
  if (Array.isArray(bundlesForCart)) {
    bundlesForCart.forEach((item) => {
      validateBundleList['bundleIdsExist'].find((isExistingBundle: object) => {
        if (item['bundleId'] === isExistingBundle['bundleId']) {
          updatebundles.push({
            checkoutBundleId: isExistingBundle['checkoutBundleId'],
            quantity: makeQuantity(item['quantity']),
          });
        }
      });
    });
  }
  return updatebundles;
};

export const getIsNotExtingBundle = async (
  bundlesForCart: CheckoutBundleInputType[],
  validateBundleList: [],
) => {
  const addnewbundles = [];
  if (Array.isArray(bundlesForCart)) {
    bundlesForCart.forEach((item) => {
      validateBundleList['bundleIdsNotExist'].find(
        (isNotExistingBundle: object) => {
          if (item['bundleId'] === isNotExistingBundle['bundleId']) {
            addnewbundles.push({
              bundleId: item['bundleId'],
              quantity: makeQuantity(item['quantity']),
            });
          }
        },
      );
    });
  }
  return addnewbundles;
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
 * It takes a list of bundles, a list of bundles for cart, and a new checkout object, and returns a
 * list of bundles for cart with line ids
 * @param {BundleType[]} bundlesList - this is the list of bundles that are selected by
 * the user and fetched from bundle Service.
 * @param {CheckoutBundleInputType[]} bundlesForCart - This is the array of bundles that we want to add
 * to the cart without lineIds.
 * @param newCheckout - The new checkout object that is returned from the server after the checkout is
 * created.
 * @returns An array of CheckoutBundleInputType
 */
export const getBundlesWithLineIds = (
  bundlesList: BundleType[],
  bundlesForCart: CheckoutBundleInputType[],
  newCheckout,
): CheckoutBundleInputType[] => {
  // convert bundlesForCart into hash
  const bundlesForCartHash = hash(
    bundlesForCart,
    (ele: CheckoutBundleInputType) => ele.bundleId,
  );

  // iterate over all selected bundles
  bundlesList.forEach((bundle) => {
    bundlesForCartHash[bundle.id].lines = [];
    // iterate over all selected bundle's variants
    bundle.variants?.forEach((variant) => {
      const line = (newCheckout?.checkout?.lines || []).find(
        (line) => line?.variant?.id == variant?.variant?.id,
      );

      // add line ids to bundlesForCart
      bundlesForCartHash[bundle.id].lines.push(line?.id);
    });
  });

  return Object.values(bundlesForCartHash);
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
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params checkoutBundleIds: checkout bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByCheckoutBundleId = (
  bundles,
  checkoutBundleIds,
) => {
  if (Array.isArray(checkoutBundleIds)) {
    return (bundles || []).filter((bundle) => {
      return checkoutBundleIds.includes(bundle?.checkoutBundleId);
    });
  } else {
    return (bundles || []).filter(
      (bundle) => checkoutBundleIds === bundle?.checkoutBundleId,
    );
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
 * @params lines: checkout lines from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params checkoutBundleIds: array of checkout bundle ids
 */
export const getCheckoutLineItemsForDelete = (
  lines,
  bundles,
  checkoutBundleIds,
) => {
  const targetBundle = getTargetBundleByCheckoutBundleId(
    bundles,
    checkoutBundleIds,
  );
  const variantIds = getVariantIds(targetBundle);

  return (lines || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      lineId: line?.id,
      quantity: line?.quantity,
    }));
};

/**
 * returns line items array for saleor api
 * @params checkoutLines: checkout lines from saleor checkout
 * @returns array of checkoutLineIds
 */
export const getCheckoutLineIds = (checkoutLines = []) => {
  return checkoutLines.map((l: any) => l?.id || l?.lineId);
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
 * @params existedCheckoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart which are again added to cart
 */
export const updateBundlesQuantity = async (
  existedCheckoutBundles: CheckoutBundleType[],
  bundlesFromCart: CheckoutBundleInputType[],
) => {
  return bundlesFromCart.map((bundle) => {
    const existedBundle = existedCheckoutBundles.find(
      (checkoutBundle) => checkoutBundle?.bundle?.id === bundle?.bundleId,
    );

    if (existedBundle) {
      const oldQuantity = makeQuantity(existedBundle?.quantity);
      const newQuantity = makeQuantity(bundle?.quantity);
      return { ...bundle, quantity: oldQuantity + newQuantity };
    }
    return bundle;
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
    (shippingMethod) => shippingMethod?.method?.shippingMethodTypeId,
  );
  const getUUID = (id) => {
    const sameMethod = (shippingMethodsFromShopService || []).find(
      (method) => method?.shippingMethodTypeId === id,
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
  return (bundles || []).filter((bundle) => bundle?.isSelected);
};

/**
 * returns array of checkoutBundleIds from bundles list (bundleId is different from checkoutBundleId)
 * @params bundles: all the bundles array from the checkout data
 */
export const getCheckoutBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.checkoutBundleId);
};

/**
 * returns dummy payment gateway for testing purpose
 * @params paymentGateways: available payment gateways
 */
export const getDummyGateway = (availablePaymentGateways = []) => {
  const dummyGateway = (availablePaymentGateways || []).find(
    (gateway) => gateway?.name === 'Dummy',
  );
  return dummyGateway?.id;
};

export const getShippingMethodsFromShippingZones = (shippingZones) => {
  let shippingMethods = [];
  shippingZones.forEach((shippingZone) => {
    shippingMethods = [
      ...shippingMethods,
      ...shippingZone?.node?.shippingMethods,
    ];
  });
  return shippingMethods;
};
