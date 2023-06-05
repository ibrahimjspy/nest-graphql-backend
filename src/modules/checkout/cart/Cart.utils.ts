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
import { CheckoutBundleInterface } from './Cart.types';
import { checkoutBundlesInterface } from 'src/external/services/osPlaceOrder/Legacy.service.types';

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
      if (v.quantity == 0) return;
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
) => {
  const checkoutLines = [];
  const bundleVariantMapping = getBundleProductVariantsMapping(bundle);
  const saleorVariantsMapping = getSaleorProductVariantsMapping(saleor);

  openPackVariants.map((variant) => {
    const saleorQuantity = saleorVariantsMapping.get(variant.oldVariantId);
    const bundleQuantity =
      variant.quantity - bundleVariantMapping.get(variant.oldVariantId);
    const quantity = (saleorQuantity || 0) + bundleQuantity;
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
  const updatedLines = [] as CheckoutLinesInterface[];
  const saleorVariantsMapping = getSaleorProductVariantsMapping(saleor);
  const bundleVariantMapping = getBundleProductVariantsMapping(bundle);

  openPackUpdates.variants.map((variant) => {
    const newVariantQuantity =
      (bundleVariantMapping.get(variant.oldVariantId) || 0) +
      (saleorVariantsMapping.get(variant.newVariantId) || 0);
    const oldVariantQuantity =
      saleorVariantsMapping.get(variant.oldVariantId) -
      bundleVariantMapping.get(variant.oldVariantId);

    updatedLines.push(
      {
        variantId: variant.newVariantId,
        quantity: Math.max(newVariantQuantity, 0),
      },
      {
        variantId: variant.oldVariantId,
        quantity: Math.max(oldVariantQuantity, 0) || 0,
      },
    );
  });
  return updatedLines as CheckoutLinesInterface;
};

/**
 * @description - this returns mapping of each bundle variant with its quantity
 */
export const getBundleProductVariantsMapping = (
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

/**
 * Updates variant media URLs in checkout bundles to use the product's thumbnail URL if they don't include "ColorSwatch".
 * @param {CheckoutBundleInterface[]} checkoutBundles - Array of checkout bundles.
 */
export const validateCheckoutVariantMedia = (
  checkoutBundles: CheckoutBundleInterface[],
): void => {
  checkoutBundles.forEach((checkoutBundle) => {
    // Get the product's thumbnail URL
    const productMedia = checkoutBundle.bundle.product.thumbnail.url;
    checkoutBundle.bundle.productVariants.forEach((variant) => {
      // Get the URL of the variant's media (assumed to be at index 0)
      const variantMedia = variant.productVariant?.media[0]?.url;
      if (!variantMedia) {
        const media = { url: productMedia };
        variant.productVariant.media[0] = media;
        return;
      }

      // Check if the variant media URL includes "ColorSwatch"
      if (!variantMedia.includes('ColorSwatch')) {
        variant.productVariant.media[0].url = productMedia;
      }
    });
  });
};

/**
 * Updates the checkout lines for a close pack based on the provided checkout bundle, bundle, and saleor checkout information.
 * @param checkoutBundle The checkout bundle containing the bundle and product variant information.
 * @param bundle The bundle response type containing the product variants.
 * @param saleor The saleor checkout interface containing the saleor checkout information.
 * @returns An array of updated checkout lines.
 */
export const getClosePackLinesReplace = (
  checkoutBundle: checkoutBundlesInterface,
  bundle: GetBundleResponseType,
  saleor: SaleorCheckoutInterface,
): CheckoutLinesInterface => {
  const updatedLines = [];
  const saleorVariantsMapping = getSaleorProductVariantsMapping(saleor);
  const oldBundleQuantity = checkoutBundle.quantity;

  // Remove old variant lines
  checkoutBundle.bundle.productVariants.forEach((variant) => {
    const variantId = variant.productVariant.id;
    const oldVariantQuantity =
      variant.quantity * checkoutBundle.quantity * variant.quantity;
    const updatedQuantity =
      saleorVariantsMapping.get(variantId) - oldVariantQuantity;
    updatedLines.push({
      variantId: variantId,
      quantity: Math.max(updatedQuantity, 0),
    });
  });

  // Add new variant lines
  bundle.data.productVariants.forEach((variant) => {
    const variantId = variant.productVariant.id;
    const newVariantLineQuantity =
      (saleorVariantsMapping.get(variantId) || 0) +
      variant.quantity * oldBundleQuantity;
    updatedLines.push({
      variantId: variantId,
      quantity: Math.max(newVariantLineQuantity, 0),
    });
  });

  return updatedLines as CheckoutLinesInterface;
};
