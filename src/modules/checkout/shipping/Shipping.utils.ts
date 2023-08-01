import { MarketplaceShippingMethodsType } from 'src/graphql/types/checkout.type';
interface ShippingMethodType {
  id: string;
  shippingMethodId: string;
}
/**
 * @description -- this function sorts shipping methods and places shipping method with promotion on top
 */
export const marketplaceShippingMethodsMap = (
  checkoutData: MarketplaceShippingMethodsType,
) => {
  const shippingMethodsMap: Map<string, ShippingMethodType[]> = new Map();
  checkoutData.checkoutBundles.map((checkoutBundle) => {
    shippingMethodsMap.set(
      checkoutBundle.checkoutId,
      checkoutBundle.bundle.shop.shippingMethods,
    );
  });
  const checkoutIds = Array.from(shippingMethodsMap.keys());
  return checkoutIds.map((checkoutId) => {
    return {
      checkoutId,
      shippingMethods: shippingMethodsMap.get(checkoutId),
    };
  });
};
