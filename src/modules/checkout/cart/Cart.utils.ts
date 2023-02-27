import { makeQuantity } from 'src/core/utils/helpers';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';

/**
 * parses checkout bundles object and returns bundle ids
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @returns bundleIds in array
 */
export const getBundleIds = async (
  bundlesForCart: CheckoutBundleInputType[],
) => {
  return bundlesForCart.map((res) => res['bundleId']);
};

/**
 * matches bundles list provided by cart and target list which is old cart state
 * returns bundles which does not exist in target cart bundles list
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @params targetBundles: bundles to be used for for matching
 * @returns newBundles  -- bundles which should be added to cart in array
 */
export const getNewBundlesList = async (
  bundlesForCart: CheckoutBundleInputType[],
  targetBundleList: [],
) => {
  const newBundles = [];
  if (Array.isArray(bundlesForCart)) {
    bundlesForCart.forEach((item) => {
      targetBundleList['bundleIdsNotExist'].find(
        (isNotExistingBundle: object) => {
          if (item['bundleId'] === isNotExistingBundle['bundleId']) {
            newBundles.push({
              bundleId: item['bundleId'],
              quantity: makeQuantity(item['quantity']),
            });
          }
        },
      );
    });
  }
  return newBundles;
};

/**
 * matches bundles list provided by cart and target list which is old cart state
 * returns bundles which exist in both, which could be used for update cart bundles
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @params targetBundles: bundles to be used for for matching
 * @returns updateBundles  -- bundles which should be updated in array
 */
export const getUpdatedBundlesList = (
  bundlesForCart: CheckoutBundleInputType[],
  targetBundles: [],
) => {
  const updateBundles = [];
  if (Array.isArray(bundlesForCart)) {
    bundlesForCart.forEach((item) => {
      targetBundles['bundleIdsExist'].find((isExistingBundle: object) => {
        if (item['bundleId'] === isExistingBundle['bundleId']) {
          updateBundles.push({
            checkoutBundleId: isExistingBundle['checkoutBundleId'],
            quantity: makeQuantity(item['quantity']),
          });
        }
      });
    });
  }
  return updateBundles;
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

/**
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleId: bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByBundleId = (bundles, bundleId) => {
  if (Array.isArray(bundleId)) {
    return (bundles || []).filter((bundle) => {
      return bundleId.some(
        (e) => e.checkoutBundleId === bundle?.checkoutBundleId,
      );
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
    bundlesObj?.bundle?.productVariants.forEach((variant) => {
      variantIds.push(variant?.productVariant?.id);
    });
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
 * returns line items array for saleor api
 * @params lines: checkout lines from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params checkoutBundleIds: array of checkout bundle ids
 */
export const getCheckoutLineItemsForDelete = (
  lines,
  bundles,
  checkoutBundleIds: string[],
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
 * @description -- this method takes saleor checkout lines and checkout bundles which are supposed to be deleted and returns updated
 * lines quantity which should be updated in Saleor
 * @params lines: checkout lines from saleor checkout
 * @params bundles: checkout bundles which are deleted
 */
export const getCheckoutDeleteLines = (lines, checkoutBundles) => {
  const checkoutLines = lines;
  (checkoutBundles || []).map((checkoutBundle) => {
    checkoutBundle?.bundle?.productVariants?.map((variant) => {
      const matchingVariant = checkoutLines.find((obj) => {
        return obj.variant.id === variant.productVariant.id;
      });
      if (matchingVariant) {
        matchingVariant.quantity = matchingVariant.quantity - variant.quantity;
      }
    });
  });
  checkoutLines.forEach(function (line) {
    delete line.variant;
  });
  return checkoutLines;
};
