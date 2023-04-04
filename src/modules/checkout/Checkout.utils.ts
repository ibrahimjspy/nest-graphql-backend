import { makeQuantity } from 'src/core/utils/helpers';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import {
  CheckoutBundleType,
  SaleorCheckoutInterface,
} from './Checkout.utils.type';
import { PROMOTION_SHIPPING_METHOD_ID } from 'src/constants';

export const toCents = (amount: any) => {
  // TODO :Math.round() - rounds to the nearest integer (if the fraction is 0.5 or greater - rounds up
  return Math.round(amount * 100);
};

/** transforms checkout bundles into checkout lines by mapping over each bundle and using its lines
 * @params bundles: all bundles array in the checkout
 * @returns array of objects containing variant id and quantity
 */
export const getLinesFromBundles = (bundles) => {
  const lines: Array<{ quantity: number; variantId: string }> = [];
  bundles.forEach((bundle) => {
    // // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = bundle?.quantity;
    bundle.bundle.productVariants?.forEach((value) =>
      lines.push({
        quantity: bundleQty * value.quantity,
        variantId: value.productVariant?.id,
      }),
    );
  });
  return lines;
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

/**
 * function validates bundles length
 * @params bundles in array
 * @returns boolean ~~ true || false
 */
export const validateBundlesLength = (bundles: any[]) => {
  return bundles.length > 0;
};

/**
 * @description -- this function sorts shipping methods and places shipping method with promotion on top
 */
export const checkoutShippingMethodsSort = (
  checkoutData: SaleorCheckoutInterface,
) => {
  checkoutData.shippingMethods.map((shippingMethod, key) => {
    if (shippingMethod.id == PROMOTION_SHIPPING_METHOD_ID) {
      checkoutData.shippingMethods.splice(key, 1);
      checkoutData.shippingMethods.splice(0, 0, shippingMethod);
    }
  });
};
