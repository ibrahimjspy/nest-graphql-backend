import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { CheckoutLinesInterface } from './services/saleor/Cart.saleor.types';
import {
  BundleCreateResponseType,
  GetBundleResponseType,
} from 'src/modules/product/Product.types';
import { NoBundleCreatedError } from '../Checkout.errors';
import { OpenPackTransactionTypeEnum } from './dto/common.dto';
import { UpdateBundleDto, UpdateOpenPackDto } from './dto/cart';
import { SaleorCheckoutInterface } from '../Checkout.utils.type';

/**
 * parses checkout bundles object and returns bundle ids
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @returns bundleIds in array
 */
export const getBundleIds = (bundlesForCart: CheckoutBundleInputType[]) => {
  return bundlesForCart.map((res) => res['bundleId']);
};

/**
 * parses checkout bundles object and returns bundle ids
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @returns bundleIds in array
 */
export const getCheckoutBundleIds = (checkoutBundles) => {
  return checkoutBundles.map((res) => res['checkoutBundleId']);
};

/**
 * parses checkout bundles object and returns bundle ids
 * @params bundlesForCart: bundles to be used for array of bundle ids
 * @returns bundleIds in array
 */
export const getBundlesFromCheckout = (checkoutBundles) => {
  const bundles = [];
  checkoutBundles.map((checkoutBundle) => {
    bundles.push({
      bundleId: checkoutBundle.bundle.id,
      quantity: checkoutBundle.quantity,
    });
  });
  return bundles;
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
 * returns line items updated bundles lines
 * @params bundles: all bundles array in the checkout
 * @params targetBundles: bundles array for which we need line items
 */
export const getUpdateCartBundleLines = (
  checkoutBundles,
  targetBundles,
): CheckoutLinesInterface => {
  const lines: any = [];
  checkoutBundles.forEach((checkoutBundle) => {
    const targetBundle = (targetBundles || []).find(
      (a) => a?.checkoutBundleId === checkoutBundle?.checkoutBundleId,
    );
    if (!targetBundle) {
      return;
    }
    // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = targetBundle?.quantity;
    checkoutBundle?.bundle?.productVariants?.forEach((v) => {
      lines.push({
        quantity: bundleQty * v?.quantity,
        variantId: v?.productVariant?.id,
      });
    });
  });
  return lines;
};

/**
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleId: bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByBundleId = (checkoutBundles, bundles) => {
  if (Array.isArray(checkoutBundles)) {
    return (checkoutBundles || []).filter((checkoutBundle) => {
      return bundles.some((e) => e.bundleId === checkoutBundle?.bundle.id);
    });
  } else {
    return (checkoutBundles || []).filter(
      (bundle) => bundles === bundle?.bundle?.id,
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
    bundlesObj?.bundle?.productVariants.forEach((variant) => {
      variantIds.push(variant?.productVariant?.id);
    });
  });
  return variantIds;
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
 * @description -- this method takes saleor checkout lines and checkout bundles which are supposed to be deleted and returns updated
 * lines quantity which should be updated in Saleor
 * @params lines: checkout lines from saleor checkout
 * @params bundles: checkout bundles which are deleted
 */
export const getDeleteBundlesLines = (lines, checkoutBundles) => {
  const checkoutLines = lines;
  (checkoutBundles || []).map((checkoutBundle) => {
    const bundleQuantity = checkoutBundle?.quantity;
    checkoutBundle?.bundle?.productVariants?.map((variant) => {
      const matchingVariant = checkoutLines.find((obj) => {
        return obj.variant.id === variant.productVariant.id;
      });
      if (matchingVariant) {
        matchingVariant.quantity =
          matchingVariant.quantity - variant.quantity * bundleQuantity;
      }
    });
  });
  checkoutLines.forEach(function (line) {
    delete line.variant;
  });
  return checkoutLines;
};

/**
 * returns line items (for saleor apis)
 * @params bundles: all bundles array fetched from bundle service
 * @params targetBundles: bundles array for which we need line items
 */
export const getAddBundleToCartLines = (
  bundlesData,
  targetBundles,
): CheckoutLinesInterface => {
  const lines: any = [];
  bundlesData?.edges?.forEach((checkoutBundle) => {
    const targetBundle = (targetBundles || []).find(
      (a) => a?.bundleId === checkoutBundle?.node.id,
    );
    if (!targetBundle) {
      return;
    }
    // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = targetBundle?.quantity;
    checkoutBundle?.node?.productVariants?.forEach((v) => {
      lines.push({
        quantity: bundleQty * v?.quantity,
        variantId: v?.productVariant?.id,
      });
    });
  });
  return lines;
};

/**
 * @description - this function returns bundle quantity from bundles
 */
export const getBundleQuantity = (bundles): number => {
  let quantity;
  bundles.map((bundle) => {
    quantity = bundle['quantity'];
  });
  return quantity;
};

/**
 * this builds a bundle create array which we can use to replace an old checkout bundle with new bundle
 * @satisfies  - it uses quantity of older checkout bundler
 */
export const getNewBundlesToAdd = (checkoutBundles, bundleId) => {
  return [
    {
      bundleId: bundleId,
      quantity: getBundleQuantity(checkoutBundles),
    },
  ];
};

/**
 * @description - this builds returns checkout bundles which are selected from checkout bundles object
 */
export const getSelectedCheckoutBundles = (checkoutBundles) => {
  return checkoutBundles.filter(
    (checkoutBundle) => checkoutBundle.isSelected == true,
  );
};

/**
 * @description - this builds returns checkout bundles which are un selected from checkout bundles object
 */
export const getUnSelectedCheckoutBundles = (checkoutBundles) => {
  return checkoutBundles.filter(
    (checkoutBundle) => checkoutBundle.isSelected == false,
  );
};

/**
 * @description - returns bundle id from bundle create response
 */
export const getBundleIdFromBundleCreate = (
  bundleCreate: BundleCreateResponseType,
) => {
  const bundleId = bundleCreate.data?.id;
  if (bundleId) {
    return bundleId;
  }
  throw new NoBundleCreatedError();
};

/**
 * @description - returns whether open pack update type is replace or quantity update
 * @pre_condition - every variant provided in bundles list should have same event, which is why we are only checking on first variant
 */
export const getOpenPackTransactionType = (
  updateOpenPack: UpdateOpenPackDto,
) => {
  const firstVariant = updateOpenPack.variants[0];
  if (firstVariant.newVariantId) return OpenPackTransactionTypeEnum.REPLACE;
  return OpenPackTransactionTypeEnum.UPDATE;
};

/**
 * @description - returns lines which should be updated in saleor in case if an open pack bundle variants quantity is updated
 * @pre_condition - every variant provided in bundles list should have same event
 */
export const getOpenPackLinesUpdate = (
  openPackVariants: UpdateBundleDto[],
  bundle: GetBundleResponseType,
  saleor: SaleorCheckoutInterface,
): CheckoutLinesInterface => {
  const checkoutLines = [];
  const bundleVariantMapping = getBundleProductVariantsQuantity(bundle);
  const saleorVariantsMapping = getSaleorProductVariantsMapping(saleor);

  openPackVariants.map((variant) => {
    const saleorQuantity = saleorVariantsMapping.get(variant.oldVariantId);
    const bundleQuantity =
      variant.quantity - bundleVariantMapping.get(variant.oldVariantId);
    const quantity = saleorQuantity + bundleQuantity;
    checkoutLines.push({
      variantId: variant.oldVariantId,
      quantity: quantity,
    });
  });
  return checkoutLines as CheckoutLinesInterface;
};

/**
 * @description - returns lines which should be updated in saleor in case if an open pack bundle variants quantity is replace with new variants
 * @pre_condition - every variant provided in bundles list should have same event
 */
export const getOpenPackLinesReplace = (
  openPackUpdates: UpdateOpenPackDto,
  bundle: GetBundleResponseType,
  saleor: SaleorCheckoutInterface,
) => {
  const updatedLines = [];
  const saleorVariantsMapping = getSaleorProductVariantsMapping(saleor);
  const bundleVariantMapping = getBundleProductVariantsQuantity(bundle);

  openPackUpdates.variants.map((variant) => {
    const newVariantQuantity =
      bundleVariantMapping.get(variant.oldVariantId) +
      (saleorVariantsMapping.get(variant.newVariantId) || 0);
    const oldVariantQuantity =
      saleorVariantsMapping.get(variant.oldVariantId) -
      bundleVariantMapping.get(variant.oldVariantId);

    updatedLines.push(
      {
        variantId: variant.newVariantId,
        quantity: newVariantQuantity,
      },
      {
        variantId: variant.oldVariantId,
        quantity: oldVariantQuantity,
      },
    );
  });
  return updatedLines as CheckoutLinesInterface;
};

/**
 * @description - this returns mapping of each bundle variant with its quantity
 */
export const getBundleProductVariantsQuantity = (
  bundle: GetBundleResponseType,
) => {
  const quantityMapping: Map<string, number> = new Map();
  bundle.data.productVariants.map((variant) => {
    quantityMapping.set(variant.productVariant.id, variant.quantity);
  });
  return quantityMapping;
};

/**
 * @description - this returns mapping of each saleor variant with its quantity
 */
export const getSaleorProductVariantsMapping = (
  saleor: SaleorCheckoutInterface,
) => {
  const quantityMapping: Map<string, number> = new Map();
  saleor.lines.map((line) => {
    quantityMapping.set(line.variant.id, line.quantity);
  });
  return quantityMapping;
};
