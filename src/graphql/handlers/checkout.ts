import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { getCheckoutQuery } from 'src/graphql/queries/users/getCheckout';
import { shoppingCartQuery } from 'src/graphql/queries/users/shoppingCart';
import { bundlesQuery } from 'src/graphql/queries/users/bundlesByBundleIds';
import { createCheckoutQuery } from 'src/graphql/queries/users/createCheckout';
import { addCheckoutBundlesQuery } from 'src/graphql/queries/users/addCheckoutBundles';
import { checkoutLinesAddQuery } from 'src/graphql/queries/users/checkoutLinesAdd';
import { deleteCheckoutBundlesQuery } from 'src/graphql/queries/users/deleteCheckoutBundle';
import { checkoutQuery } from 'src/graphql/queries/users/checkout';
import { checkoutLinesDeleteQuery } from 'src/graphql/queries/users/checkoutLinesDelete';
import { checkoutLinesUpdateQuery } from 'src/graphql/queries/users/checkoutLinesUpdate';
interface BundleTypes {
  bundleId: string;
  quantity: number;
}

export const shoppingCartHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shoppingCartQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addToCartHandler = async (
  userId: string,
  bundles: Array<BundleTypes>,
): Promise<object> => {
  try {
    const bundleIds = (bundles || []).map((b) => b?.bundleId);

    //Fetching bundles list with all variants
    const bundlesList: any = await bundlesListHandler(bundleIds);

    const lines = [];

    // Creating lines (items) for sending in checkout api
    bundlesList?.bundles.forEach((b) => {
      const targetBundle = (bundles || []).find((a) => a?.bundleId === b?.id);

      // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
      const bundleQty = targetBundle?.quantity;
      b?.variants?.forEach((v) =>
        lines.push({
          quantity: bundleQty * v?.quantity,
          variantId: v?.variant?.id,
        }),
      );
    });

    if ((bundlesList?.bundles || []).length) {
      // Checkout call
      const checkout: any = await getCheckoutHandler(userId);
      const checkoutId = checkout?.marketplaceCheckout?.checkoutId;

      if (checkoutId) {
        await checkoutLinesAddHandler(checkoutId, lines);

        // add checkout to shop service
        return await addCheckoutBundlesHandler(checkoutId, userId, bundles);
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
    const targetBundle = (bundles || []).filter((b) =>
      checkoutBundleIds.includes(b?.checkoutBundleId),
    );
    if (targetBundle?.length) {
      const variantIds = [];
      targetBundle.forEach((v) => {
        v?.bundle?.variants.forEach((b) => variantIds.push(b?.variant?.id));
      });
      const saleorCheckout: any = await checkoutHandler(checkoutId);
      const linesIds = saleorCheckout?.checkout?.lines;
      const targetLineIds = (linesIds || []).filter((l) =>
        variantIds.includes(l?.variant?.id),
      );
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
    const checkoutData: any = await getCheckoutHandler(userId);
    const checkoutId = checkoutData?.marketplaceCheckout?.checkoutId;
    const checkoutBundles = checkoutData?.marketplaceCheckout?.bundles;
    const targetBundle = (checkoutBundles || []).filter((b) =>
      checkoutBundleIds.includes(b?.checkoutBundleId),
    );
    if (targetBundle?.length) {
      const variantIds = [];
      targetBundle.forEach((v) => {
        v?.bundle?.variants.forEach((b) => variantIds.push(b?.variant?.id));
      });
      const saleorCheckout: any = await checkoutHandler(checkoutId);
      const linesIds = saleorCheckout?.checkout?.lines;
      const targetLineIds = (linesIds || []).filter((l) =>
        variantIds.includes(l?.variant?.id),
      );
      // For Saleor
      await checkoutLinesDeleteHandler(targetLineIds);
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
  linedIds: Array<string>,
): Promise<object> => {
  try {
    return await graphqlCall(
      checkoutLinesUpdateQuery(
        checkoutId,
        (linedIds || []).map((l: any) => l?.id),
      ),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
