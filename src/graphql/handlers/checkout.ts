import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { getCheckoutQuery } from 'src/graphql/queries/checkout/getCheckout';
import { shoppingCartQuery } from 'src/graphql/queries/checkout/shoppingCart';
import { bundlesQuery } from 'src/graphql/queries/checkout/bundlesByBundleIds';
import { createCheckoutQuery } from 'src/graphql/queries/checkout/createCheckout';
import { addCheckoutBundlesQuery } from 'src/graphql/queries/checkout/addCheckoutBundles';
import { checkoutLinesAddQuery } from 'src/graphql/queries/checkout/checkoutLinesAdd';
import { deleteCheckoutBundlesQuery } from 'src/graphql/queries/checkout/deleteCheckoutBundle';
import { checkoutQuery } from 'src/graphql/queries/checkout/checkout';
import { checkoutLinesDeleteQuery } from 'src/graphql/queries/checkout/checkoutLinesDelete';
import { checkoutLinesUpdateQuery } from 'src/graphql/queries/checkout/checkoutLinesUpdate';
import { shippingAddressQuery } from 'src/graphql/queries/checkout/shippingAddress';
import { billingAddressQuery } from 'src/graphql/queries/checkout/billingAddress';

import {
  getLineItems,
  getTargetBundle,
  getVariantIds,
  getTargetLineIds,
  updateBundlesQuantity,
  getTargetBundleByBundleId,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';

export const shoppingCartHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shoppingCartQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addToCartHandler = async (
  userId: string,
  bundles: Array<{
    bundleId: string;
    quantity: number;
  }>,
): Promise<object> => {
  try {
    const bundleIds = (bundles || []).map((bundle) => bundle?.bundleId);
    //Fetching bundles list with all variants
    const allBundles: any = await bundlesListHandler(bundleIds);
    const lines = getLineItems(allBundles?.bundles, bundles);
    if ((allBundles?.bundles || []).length) {
      // Checkout call
      const checkout: any = await getCheckoutHandler(userId);
      const allCheckoutBundles = checkout?.marketplaceCheckout?.bundles;
      const checkoutId = checkout?.marketplaceCheckout?.checkoutId;
      if (checkoutId) {
        await checkoutLinesAddHandler(checkoutId, lines);
        // add checkout to shop service

        const bundlesWithUpdatedQuantity = updateBundlesQuantity(
          allCheckoutBundles,
          bundles,
        );
        // update quantity here
        return await addCheckoutBundlesHandler(
          checkoutId,
          userId,
          bundlesWithUpdatedQuantity,
        );
      } else {
        // create new checkout
        const newCheckout: any = await createCheckoutHandler(lines);
        const newCheckoutId = newCheckout?.checkoutCreate?.checkout?.id;
        // add checkout to shop service
        if (newCheckoutId) {
          return await addCheckoutBundlesHandler(
            newCheckoutId,
            userId,
            bundles,
          );
        }
      }
    } else {
      return { message: 'No bundles found' };
    }
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const bundleSelectionHandler = async (
  userId: string,
  bundleIds: Array<string>,
  isSelected: boolean,
): Promise<object> => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const checkoutId = checkoutData?.marketplaceCheckout?.checkoutId;
    const bundles = checkoutData?.marketplaceCheckout?.bundles;
    const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
    if (targetBundle?.length) {
      const variantIds = getVariantIds(targetBundle);
      const saleorCheckout: any = await checkoutHandler(checkoutId);
      const targetLineItems = getTargetLineIds(saleorCheckout, variantIds);
      if (isSelected) {
        await checkoutLinesAddHandler(checkoutId, targetLineItems);
      } else {
        await checkoutLinesDeleteHandler(targetLineItems);
      }
      const updatedTargetBundle = targetBundle.map((bundle) => ({
        bundleId: bundle?.bundle?.id,
        quantity: bundle?.quantity,
        isSelected,
      }));
      return await addCheckoutBundlesHandler(
        checkoutId,
        userId,
        updatedTargetBundle,
      );
    } else {
      return { message: 'This bundle does not exist in the cart' };
    }
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const bundlesListHandler = async (
  bundleIds: Array<string>,
): Promise<object> => {
  try {
    return await graphqlCall(bundlesQuery(bundleIds));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getCheckoutHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(getCheckoutQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createCheckoutHandler = async (
  lines: Array<{ quantity: number; variantId: string }>,
): Promise<object> => {
  try {
    return await graphqlCall(createCheckoutQuery(lines));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addCheckoutBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
): Promise<object> => {
  try {
    return await graphqlCall(
      addCheckoutBundlesQuery(checkoutId, userId, bundles),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutLinesAddHandler = async (
  checkoutId,
  bundles: Array<{ quantity: number; variantId: string }>,
): Promise<object> => {
  try {
    return await graphqlCall(checkoutLinesAddQuery(checkoutId, bundles));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const deleteBundleFromCartHandler = async (
  userId: string,
  checkoutBundleIds: Array<string>,
): Promise<object> => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const checkoutId = checkoutData?.marketplaceCheckout?.checkoutId;
    const bundles = checkoutData?.marketplaceCheckout?.bundles;
    const targetBundle = getTargetBundle(bundles, checkoutBundleIds);
    if (targetBundle?.length) {
      const variantIds = getVariantIds(targetBundle);
      const saleorCheckout: any = await checkoutHandler(checkoutId);
      const targetLineIds = getTargetLineIds(saleorCheckout, variantIds);
      // For saleor
      await checkoutLinesDeleteHandler(targetLineIds);
      // For shop service
      return await deleteCheckoutBundlesHandler(checkoutBundleIds, checkoutId);
    } else {
      return { message: 'This bundle does not exist in the cart' };
    }
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const updateBundleFromCartHandler = async (
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
): Promise<object> => {
  try {
    const checkoutBundleIds = bundles.map((bundle) => bundle?.bundleId);
    const quantity = bundles[0]?.quantity;
    const checkoutData: any = await getCheckoutHandler(userId);
    const checkoutId = checkoutData?.marketplaceCheckout?.checkoutId;
    const checkoutBundles = checkoutData?.marketplaceCheckout?.bundles;
    const targetBundle = getTargetBundleByBundleId(
      checkoutBundles,
      checkoutBundleIds,
    );
    if (targetBundle?.length) {
      const variantIds = getVariantIds(targetBundle);
      const saleorCheckout: any = await checkoutHandler(checkoutId);
      const targetLineItems = getTargetLineIds(saleorCheckout, variantIds);
      const updatedLinesWithQuantity = getUpdatedLinesWithQuantity(
        targetLineItems,
        quantity,
      );
      // For Saleor
      await checkoutLinesUpdateHandler(checkoutId, updatedLinesWithQuantity);
      // For Shop service
      return await addCheckoutBundlesHandler(checkoutId, userId, bundles);
    } else {
      return { message: 'This bundle does not exist in the cart' };
    }
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutHandler = async (checkoutId: string): Promise<object> => {
  try {
    return await graphqlCall(checkoutQuery(checkoutId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

// Towards saleor service
export const checkoutLinesDeleteHandler = async (
  linedIds: Array<string>,
): Promise<object> => {
  try {
    return await graphqlCall(
      checkoutLinesDeleteQuery((linedIds || []).map((l: any) => l?.id)),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

// Towards shop service
export const deleteCheckoutBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
): Promise<object> => {
  try {
    return await graphqlCall(
      deleteCheckoutBundlesQuery(checkoutBundleIds, checkoutId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

// Towards saleor service
export const checkoutLinesUpdateHandler = async (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
): Promise<object> => {
  try {
    return await graphqlCall(checkoutLinesUpdateQuery(checkoutId, lines));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const shippingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  try {
    return await graphqlCall(shippingAddressQuery(checkoutId, addressDetails));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const billingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  try {
    return await graphqlCall(billingAddressQuery(checkoutId, addressDetails));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
