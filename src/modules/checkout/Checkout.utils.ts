import {
  LessInventoryProductType,
  SaleorCheckoutInterface,
} from './Checkout.utils.type';
import { PROMOTION_SHIPPING_METHOD_ID } from 'src/constants';

export const toCents = (amount: number) => {
  return Math.round(amount * 100);
};

/**
 * @description -- this function sorts shipping methods and places shipping method with promotion on top
 */
export const checkoutShippingMethodsSort = (
  checkoutData: SaleorCheckoutInterface,
) => {
  checkoutData.shippingMethods.map((shippingMethod, key) => {
    if (shippingMethod.id == PROMOTION_SHIPPING_METHOD_ID) {
      checkoutData.shippingMethods.splice(key, 1);
      checkoutData.shippingMethods.splice(0, 0, shippingMethod);
    }
  });
};

/**
 * @description -- this function takes checkout response and pre auth amount and adds preauth amount in checkout response
 */
export const addPreAuthInCheckoutResponse = (
  preAuthAmount: number,
  checkoutData: SaleorCheckoutInterface,
) => {
  checkoutData.preAuth = { gross: { amount: preAuthAmount } };
};

/**
 * @description -- this function filter attribute value from given attributes array
 * @param attributes - all attributes array
 * @param attributeName - attribute name for filter
 * @return {string[]} filtered attribute value if found
 */
export const getAttributeValues = (attributes, attributeName: string) => {
  let attributeValue: string[] = [];
  attributes.forEach((attribute) => {
    if (
      attribute?.attribute?.name?.toLowerCase() === attributeName?.toLowerCase()
    ) {
      attributeValue = attribute?.values?.map((value) => value?.name);
    }
  });
  return attributeValue;
};

/**
 * @description -- this function filter metadata object from given metadata array
 * @param allMetadata - all metadata array
 * @param keyName -  metadata key name for filter
 * @return {string} filtered metadata object value if found
 */
export const getMetadataValue = (allMetadata, keyName: string) => {
  let metadataValue: string;
  allMetadata.forEach((metadata) => {
    if (metadata?.key?.toLowerCase() === keyName?.toLowerCase()) {
      metadataValue = metadata?.value;
    }
  });
  return metadataValue;
};

/**
 * @description -- this function takes order detail response and
 * return products which have less inventory for order
 * @param orderDetailResponse - Order detail response
 * @return {LessInventoryProductType[]} products with required information
 */
export const getLessInventoryProducts = (orderDetailResponse) => {
  const order = orderDetailResponse?.data;
  const products: LessInventoryProductType[] = [];
  if (order && order?.lines?.length) {
    order?.lines.forEach((line) => {
      // if (line.quantity > line.variant.stocks[0].quantity) {
      const variantColors = getAttributeValues(
        line.variant.attributes,
        'color',
      );
      products.push({
        productId: line.variant.product.id,
        productVendorId: getMetadataValue(
          line.variant.product.metadata,
          'vendorId',
        ),
        variantColor: variantColors?.length && variantColors[0],
        quantity: line.quantity,
      });
      // }
    });
  }
  return products;
};
