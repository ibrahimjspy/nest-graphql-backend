import { Logger } from '@nestjs/common';
import { PROMOTION_SHIPPING_METHOD_ID } from 'src/constants';
import { MarketplaceShippingMethodsType } from 'src/graphql/types/checkout.type';
import { ShippingMethodSaleorType } from 'src/graphql/types/shipping';
import {
  CheckoutShippingMethodType,
  MappedShippingMethodsType,
} from './Shipping.types';
interface ShippingMethodType {
  id: string;
  shippingMethodId: string;
  shippingMethodTypeId: string;
}
/**
 * Maps marketplace checkout data with corresponding shipping methods.
 * @param {MarketplaceShippingMethodsType} checkoutData - The checkout data containing checkout bundles and their shipping methods.
 * @param {ShippingMethodSaleorType[]} shippingMethods - The list of all available shipping methods.
 * @returns {Array<{ checkoutId: string; shippingMethods: Array<{ shippingMethodId: string; name: string | undefined; }> }>}
 * An array containing checkout IDs and their associated shipping methods with names.
 */
export const marketplaceShippingMethodsMap = (
  checkoutData: MarketplaceShippingMethodsType,
  shippingMethods: ShippingMethodSaleorType[],
) => {
  // Create a map to store checkout IDs as keys and their associated shipping methods as values.
  const shippingMethodsMap: Map<string, ShippingMethodType[]> = new Map();

  // Iterate through each checkout bundle in the checkoutData.
  checkoutData.checkoutBundles.forEach((checkoutBundle) => {
    // Set the checkout ID as the key and the shop's shipping methods as the value in the map.
    shippingMethodsMap.set(
      checkoutBundle.checkoutId,
      checkoutBundle.bundle.shop.shippingMethods,
    );
  });

  // Retrieve an array of unique checkout IDs from the map.
  const checkoutIds = Array.from(shippingMethodsMap.keys());

  // Map through each checkout ID to retrieve the associated shipping methods with names.
  return checkoutIds.map((checkoutId) => {
    // Get the shipping methods array for the current checkout ID.
    const checkoutShippingMethods = shippingMethodsMap.get(checkoutId);

    // Map through the checkoutShippingMethods to get the shipping methods with names.
    const mappedShippingMethods = checkoutShippingMethods.map(
      (checkoutShippingMethod) => {
        // Find the saleorShippingMethod that matches the shippingMethodTypeId of the checkoutShippingMethod.
        const saleorShippingMethod = shippingMethods.find(
          (shippingMethod) =>
            shippingMethod.id === checkoutShippingMethod.shippingMethodTypeId,
        );

        // Return an object containing the shippingMethodId and name (if found).
        return {
          shippingMethodId: checkoutShippingMethod.shippingMethodId,
          name: saleorShippingMethod?.name, // Use optional chaining to handle undefined names.
          metadata: saleorShippingMethod?.metadata,
        };
      },
    );

    // Return an object containing the checkoutId and mappedShippingMethods.
    return {
      checkoutId,
      shippingMethods: checkoutShippingMethodsFilter(mappedShippingMethods),
    };
  });
};

/**
 * Filters and re-sorts shipping methods to accommodate a promotion shipping method.
 *
 * @param {Array} shippingMethods - An array of shipping methods to be filtered and re-sorted.
 * @returns {Array} - The filtered and re-sorted shipping methods array.
 */
const checkoutShippingMethodsFilter = (
  shippingMethods: {
    shippingMethodId: string;
    name: string;
    metadata: any[];
  }[],
) => {
  shippingMethods = shippingMethods.filter(
    (shippingMethod) => !!shippingMethod.name,
  );

  shippingMethods.map((shippingMethod, key) => {
    if (shippingMethod.shippingMethodId === PROMOTION_SHIPPING_METHOD_ID) {
      Logger.log(
        'ReSorting shipping methods to accommodate promotion shipping method',
        PROMOTION_SHIPPING_METHOD_ID,
      );
      shippingMethods.splice(key, 1);
      shippingMethods.splice(0, 0, shippingMethod);
    }
  });

  return shippingMethods;
};

/**
 * Adds and sorts shipping methods in the given `mappedShippingMethods` array
 * based on checkout data and delivery methods.
 *
 * @param {MappedShippingMethodsType[]} mappedShippingMethods - Array of mapped shipping methods.
 * @param {CheckoutShippingMethodType[]} checkoutShippingMethods - Array of checkout shipping methods data.
 * @returns {MappedShippingMethodsType[]} Updated mapped shipping methods array with sorted shipping methods.
 */
export const addCheckoutShippingMethod = (
  mappedShippingMethods: MappedShippingMethodsType[],
  checkoutShippingMethods: CheckoutShippingMethodType[],
): MappedShippingMethodsType[] => {
  return mappedShippingMethods.map((mappedMethod) => {
    // Find the checkout shipping method data for the current mapped method
    const checkoutMethod = checkoutShippingMethods.find(
      (checkout) => checkout.data.id === mappedMethod.checkoutId,
    );

    if (checkoutMethod && checkoutMethod.data.deliveryMethod?.id) {
      // If checkout data and delivery method are present
      const deliveryMethodId = checkoutMethod.data.deliveryMethod?.id;
      let existingShippingMethods = mappedMethod.shippingMethods;
      // If there are no existing shipping methods then use checkout shipping methods
      if (!existingShippingMethods.length) {
        existingShippingMethods = checkoutMethod.data.shippingMethods.map(
          (checkoutShippingMethod) => ({
            shippingMethodId: checkoutShippingMethod.id,
            name: checkoutShippingMethod.name,
            metadata: checkoutShippingMethod.metadata,
          }),
        );
      }

      // Sort the existing shipping methods based on the delivery method's ID
      const sortedMethods = existingShippingMethods.sort((a, b) => {
        if (a.shippingMethodId === deliveryMethodId) return -1;
        if (b.shippingMethodId === deliveryMethodId) return 1;
        return 0;
      });

      return {
        checkoutId: mappedMethod.checkoutId,
        shippingMethods: sortedMethods,
      };
    } else if (!mappedMethod.shippingMethods.length) {
      // If checkout data is present but no delivery method is specified
      // Replace empty shippingMethods with checkout shipping methods and sort by checkout ID

      const sortedMethods = checkoutMethod.data.shippingMethods.map(
        (checkoutShippingMethod) => ({
          shippingMethodId: checkoutShippingMethod.id,
          name: checkoutShippingMethod.name,
          metadata: checkoutShippingMethod.metadata,
        }),
      );

      return {
        checkoutId: mappedMethod.checkoutId,
        shippingMethods: sortedMethods,
      };
    } else {
      // If there's no checkout method, keep the shipping methods as is
      return {
        checkoutId: mappedMethod.checkoutId,
        shippingMethods: mappedMethod.shippingMethods,
      };
    }
  });
};
