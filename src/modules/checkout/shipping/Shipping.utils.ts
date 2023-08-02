import { MarketplaceShippingMethodsType } from 'src/graphql/types/checkout.type';
import { ShippingMethodSaleorType } from 'src/graphql/types/shipping';
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
        };
      },
    );

    // Return an object containing the checkoutId and mappedShippingMethods.
    return {
      checkoutId,
      shippingMethods: mappedShippingMethods,
    };
  });
};
