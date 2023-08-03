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
import { BundleCreateDto } from 'src/modules/product/dto/bundle';
import { Logger } from '@nestjs/common';

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
  if (!validateReplaceCheckoutBundle(checkoutBundle, bundle)) return;
  // Remove old variant lines
  checkoutBundle.bundle.productVariants.forEach((variant) => {
    const variantId = variant.productVariant.id;
    const oldVariantQuantity = variant.quantity * checkoutBundle.quantity;
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

/**
 * Validates whether a replacement checkout bundle is different from the existing bundle.
 *
 * @param {checkoutBundlesInterface} checkoutBundle - The existing checkout bundle.
 * @param {GetBundleResponseType} bundle - The replacement bundle.
 * @returns {boolean} - True if the replacement bundle is different, false otherwise.
 */
export const validateReplaceCheckoutBundle = (checkoutBundle, bundle) => {
  if (checkoutBundle.bundle.id === bundle.data.id) {
    return false;
  }
  return true;
};

/**
 * Validates and processes the creation of open packs based on the existing checkout bundles and open bundles data.
 * @param checkoutBundles - An array of CheckoutBundleInterface objects representing the existing checkout bundles.
 * @param openBundles - An array of BundleCreateDto objects representing the open bundles to be created.
 * @param checkoutId - The ID of the checkout.
 * @returns An object containing the updated open packs and the filtered open bundles to be created.
 */
export const validateOpenPackCreate = (
  checkoutBundles: CheckoutBundleInterface[],
  openBundles: BundleCreateDto[],
  checkoutId: string,
) => {
  const updatedOpenPack: UpdateOpenPackDto[] = [];
  const openBundlesVariantMapping = openPackCreateVariantsMapping(openBundles);
  const updatedVariants: string[] = [];

  for (const checkoutBundle of checkoutBundles) {
    const updateBundle: UpdateOpenPackDto = {
      checkoutId,
      bundleId: checkoutBundle.bundle.id,
      variants: [],
    };

    for (const productVariant of checkoutBundle.bundle.productVariants) {
      const variantId = productVariant.productVariant.id;

      if (openBundlesVariantMapping.has(variantId)) {
        const quantity = openBundlesVariantMapping.get(variantId);
        const updatedQuantity = productVariant.quantity + quantity;
        updatedVariants.push(variantId);

        updateBundle.variants.push({
          oldVariantId: variantId,
          quantity: updatedQuantity,
        });
      }
    }

    if (updateBundle.variants.length) {
      updatedOpenPack.push(updateBundle);
    }
  }

  const openBundlesCreate = filterOpenBundlesCreate(
    openBundles,
    updatedVariants,
  );

  return {
    updatedOpenPack,
    openBundlesCreate,
  };
};

/**
 * Creates a mapping of variant IDs to quantities from the open bundles.
 * @param openBundles - An array of BundleCreateDto objects representing the open bundles.
 * @returns A Map with variant IDs as keys and quantities as values.
 */
export const openPackCreateVariantsMapping = (
  openBundles: BundleCreateDto[],
): Map<string, number> => {
  const quantityMapping: Map<string, number> = new Map();

  for (const openBundle of openBundles) {
    for (const productVariant of openBundle.productVariants) {
      quantityMapping.set(
        productVariant.productVariantId,
        productVariant.quantity,
      );
    }
  }

  return quantityMapping;
};

/**
 * Filters the open bundles based on the updated variant IDs.
 * @param openBundles - An array of BundleCreateDto objects representing the open bundles.
 * @param updatedVariants - An array of variant IDs that have been updated.
 * @returns The filtered array of open bundles.
 */
export const filterOpenBundlesCreate = (
  openBundles: BundleCreateDto[],
  updatedVariants: string[],
): BundleCreateDto[] => {
  return openBundles.filter((openBundle) => {
    const variantId = openBundle.productVariants[0].productVariantId;
    return !updatedVariants.includes(variantId);
  });
};

/**
 * Validates and processes open pack update based on the checkout bundles and update data.
 * @param checkoutBundles - An array of CheckoutBundleInterface objects representing the existing checkout bundles.
 * @param updateOpenBundle - The UpdateOpenPackDto object representing the open pack update data.
 * @returns An object containing information about the update operation.
 */
export const validateOpenPackUpdate = (
  checkoutBundles: CheckoutBundleInterface[],
  updateOpenBundle: UpdateOpenPackDto,
) => {
  const { variantMapping, newVariants, oldVariants } =
    getOpenPackUpdateMappings(updateOpenBundle);

  const oldVariantQuantityMapping: Map<string, number> = new Map();
  const deleteCheckoutBundleIds: string[] = [];
  let allReadyExists = false;
  const updatedOldVariantsPack: UpdateOpenPackDto = {
    checkoutId: updateOpenBundle.checkoutId,
    bundleId: null,
    variants: [],
  };

  // Process new variants
  for (const checkoutBundle of checkoutBundles) {
    for (const variant of checkoutBundle.bundle.productVariants) {
      const variantId = variant.productVariant.id;

      if (oldVariants.includes(variantId)) {
        Logger.log(
          `variant id ${variantId} all ready exists in users cart session`,
        );
        oldVariantQuantityMapping.set(variantId, variant.quantity);
        deleteCheckoutBundleIds.push(checkoutBundle.checkoutBundleId);
      }
    }
  }

  // Process old variants
  for (const checkoutBundle of checkoutBundles) {
    for (const variant of checkoutBundle.bundle.productVariants) {
      const variantId = variant.productVariant.id;

      if (newVariants.includes(variantId)) {
        allReadyExists = true;
        const quantity = variant.quantity;
        const updatedQuantity =
          quantity +
          (oldVariantQuantityMapping.get(variantMapping.get(variantId)) || 0);
        updatedOldVariantsPack.bundleId = checkoutBundle.bundle.id;
        updatedOldVariantsPack.variants.push({
          oldVariantId: variantId,
          quantity: updatedQuantity,
        });
      }
    }
  }

  return {
    allReadyExists,
    deleteCheckoutBundles: [...new Set(deleteCheckoutBundleIds)],
    updatedOldVariantsPack,
  };
};

/**
 * Retrieves the variant mapping, old variants, and new variants from the UpdateOpenPackDto object.
 * @param openBundles - The UpdateOpenPackDto object representing the open pack update data.
 * @returns An object containing the variant mapping, old variants, and new variants.
 */
export const getOpenPackUpdateMappings = (openBundles: UpdateOpenPackDto) => {
  const variantMapping: Map<string, string> = new Map();
  const oldVariants: string[] = [];
  const newVariants: string[] = [];

  for (const variant of openBundles.variants) {
    oldVariants.push(variant.oldVariantId);
    newVariants.push(variant.newVariantId);
    variantMapping.set(variant.newVariantId, variant.oldVariantId);
  }

  return { variantMapping, oldVariants, newVariants };
};

export const getUpdateMarketplaceCheckoutBundles = (
  bundlesList: CheckoutBundleInputType[],
  checkoutId: string,
) => {
  return bundlesList.map((bundle) => {
    return {
      checkoutId,
      bundleId: bundle.bundleId,
    };
  });
};

/**
 * Retrieves flat fulfillment checkout IDs from an array of checkout bundles.
 * Flat fulfillment checkout IDs are added to the result array if either
 * 'issharovefulfillment' or 'isownflatshipping' field is set to 'true' in the checkout bundle.
 * @param {checkoutBundlesInterface[]} checkoutBundles - An array of checkout bundles.
 * @returns {string[]} An array containing unique flat fulfillment checkout IDs.
 */
export const getFlatFulfillmentCheckoutIds = (
  checkoutBundles: checkoutBundlesInterface[],
) => {
  enum FlatShippingEnum {
    SharoveFulfillment = 'issharovefulfillment',
    VendorFulfillment = 'isownflatshipping',
  }
  // Initialize an empty array to store the checkout IDs with flat fulfillment.
  const checkoutIds: string[] = [];

  // Loop through each checkout bundle in the input array.
  checkoutBundles.map((checkoutBundle) => {
    // Find the 'issharovefulfillment' field in the shop fields of the checkout bundle.
    const sharoveFlatShippingField = checkoutBundle.bundle.shop.fields.find(
      (field) => field.name == FlatShippingEnum.SharoveFulfillment,
    );

    // Find the 'isownflatshipping' field in the shop fields of the checkout bundle.
    const vendorFlatShippingField = checkoutBundle.bundle.shop.fields.find(
      (field) => field.name == FlatShippingEnum.VendorFulfillment,
    );

    // Check if either 'issharovefulfillment' or 'isownflatshipping' is set to 'true'.
    if (
      sharoveFlatShippingField?.values[0] === 'true' ||
      vendorFlatShippingField?.values[0] === 'true'
    ) {
      // If either is 'true', add the checkout ID to the result array.
      checkoutIds.push(checkoutBundle.checkoutId);
    }
  });

  // Return an array containing unique checkout IDs with flat fulfillment.
  // Using the 'Set' data structure to remove duplicate values, then converting it back to an array.
  return Array.from(new Set(checkoutIds));
};
