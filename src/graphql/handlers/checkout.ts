import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { v4 as uuidv4 } from 'uuid';
import { getCheckoutQuery } from 'src/graphql/queries/checkout/getCheckout';
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
import { shippingBillingAddressQuery } from 'src/graphql/queries/checkout/shippingBillingAddress';
import { addCheckoutShippingMethodsQuery } from 'src/graphql/queries/checkout/addCheckoutShippingMethods';
import { checkoutDeliveryMethodUpdateQuery } from 'src/graphql/queries/checkout/checkoutDeliveryMethodUpdate';
import { checkoutPaymentCreateQuery } from 'src/graphql/queries/checkout/checkoutPaymentCreate';
import { availablePaymentGatewaysQuery } from 'src/graphql/queries/checkout/availablePaymentGateways';
import { checkoutCompleteQuery } from 'src/graphql/queries/checkout/checkoutComplete';
import { userQuery } from 'src/graphql/queries/user/getUser';
import { checkoutEmailUpdateQuery } from 'src/graphql/queries/user/checkoutEmailUpdate';

import {
  getLineItems,
  getTargetBundle,
  getVariantIds,
  getTargetLineIds,
  getShippingMethods,
  updateBundlesQuantity,
  getTargetBundleByBundleId,
  getShippingMethodsWithUUID,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';

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
      const { checkoutId, bundles: allCheckoutBundles } =
        checkout?.marketplaceCheckout || {};
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
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
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
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
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
    const { checkoutId, bundles: checkoutBundles } =
      checkoutData?.marketplaceCheckout || {};
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

export const shippingBillingAddress = async (
  checkoutId: string,
): Promise<object> => {
  try {
    return await graphqlCall(shippingBillingAddressQuery(checkoutId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getShippingMethodHandler = async (
  userId: string,
): Promise<object> => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, selectedMethods, bundles } =
      checkoutData?.marketplaceCheckout || {};
    const saleorCheckout: any = await checkoutHandler(checkoutId);
    const methodsListFromShopService = getShippingMethods(bundles);
    const methodsListFromSaleor = getShippingMethodsWithUUID(
      saleorCheckout?.checkout?.shippingMethods,
      methodsListFromShopService,
      selectedMethods,
    );
    return methodsListFromSaleor;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const selectShippingMethods = async (
  userId: string,
  shippingIds: Array<string>,
): Promise<object> => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, selectedMethods } =
      checkoutData?.marketplaceCheckout || {};
    await addCheckoutShippingMethodHandler(checkoutId, shippingIds);
    await checkoutDeliveryMethodUpdateHandler(
      checkoutId,
      selectedMethods[0]?.method?.shippingMethodId,
    );
    return await getShippingMethodHandler(userId);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addCheckoutShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
) => {
  try {
    return await graphqlCall(
      addCheckoutShippingMethodsQuery(checkoutId, shopShippingMethodIds),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutDeliveryMethodUpdateHandler = async (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  try {
    return await graphqlCall(
      checkoutDeliveryMethodUpdateQuery(checkoutId, deliveryMethodId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createPaymentHandler = async (userId: string) => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const checkoutId = checkoutData?.marketplaceCheckout?.checkoutId;
    const paymentGateways: any = await availablePaymentGatewaysHandler(
      checkoutId,
    );
    const dummyGateway = (
      paymentGateways?.checkout?.availablePaymentGateways || []
    ).find((gateway) => gateway?.name === 'Dummy');
    const userResponse: any = await getUserHandler(userId);
    const token = uuidv4();
    await checkoutEmailUpdateHandler(checkoutId, userResponse?.user?.email);
    return await graphqlCall(
      checkoutPaymentCreateQuery(checkoutId, dummyGateway?.id, token),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const availablePaymentGatewaysHandler = async (checkoutId: string) => {
  try {
    return await graphqlCall(availablePaymentGatewaysQuery(checkoutId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getUserHandler = async (userId: string) => {
  try {
    return await graphqlCall(userQuery(userId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutEmailUpdateHandler = async (
  checkoutId: string,
  email: string,
) => {
  try {
    return await graphqlCall(checkoutEmailUpdateQuery(checkoutId, email));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutCompleteHandler = async (userId: string) => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
    const selectedBundles = bundles.filter((bundle) => bundle?.isSelected);
    const checkoutBundleIds = selectedBundles.map(
      (bundle) => bundle?.checkoutBundleId,
    );
    const checkoutCompleteResponse = await graphqlCall(
      checkoutCompleteQuery(checkoutId),
    );
    await deleteCheckoutBundlesHandler(checkoutBundleIds, checkoutId);
    return checkoutCompleteResponse;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
