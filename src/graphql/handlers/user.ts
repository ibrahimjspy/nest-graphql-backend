import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { getCheckoutQuery } from 'src/graphql/queries/users/checkout';
import { shoppingCartQuery } from 'src/graphql/queries/users/shoppingCart';
import { bundlesQuery } from 'src/graphql/queries/users/bundlesByBundleIds';
import { createCheckoutQuery } from 'src/graphql/queries/users/createCheckout';
import { addCheckoutBundlesQuery } from 'src/graphql/queries/users/addCheckoutBundles';
import { checkoutLinesAddQuery } from 'src/graphql/queries/users/checkoutLinesAdd';

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
    const bundlesList: any = await bundlesListHandler(bundleIds);

    const lines = [];

    bundlesList?.bundles.forEach((b) => {
      b?.variants?.forEach((v) =>
        lines.push({ quantity: v?.quantity, variantId: v?.variant?.id }),
      );
    });

    if (bundlesList) {
      const checkout: any = await getCheckoutHandler(userId);
      const checkoutId = checkout?.getCheckout?.checkoutId;
      if (checkoutId) {
        return await checkoutLinesAddHandler(checkoutId, lines);
      } else {
        const newCheckout: any = await createCheckoutHandler(lines);

        const newCheckoutId = newCheckout?.checkoutCreate?.checkout?.id;

        if (newCheckoutId) {
          return await addCheckoutBundlesHandler(
            newCheckoutId,
            userId,
            bundles,
          );
        }
      }
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
