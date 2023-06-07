import { Logger } from '@nestjs/common';
import {
  MetadataType,
  OsOrderResponseInterface,
  ProductType,
  SaleorCheckoutInterface,
  attributeType,
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
      Logger.log(
        'ReSorting shipping methods to accommodate promotion shipping method',
        PROMOTION_SHIPPING_METHOD_ID,
      );
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
export const getAttributeValues = (
  attributes: attributeType[],
  attributeName: string,
) => {
  let attributeValue: string[] = [];
  attributes?.forEach((attribute) => {
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
export const getMetadataValue = (
  allMetadata: MetadataType[],
  keyName: string,
) => {
  let metadataValue: string;
  allMetadata?.forEach((metadata) => {
    if (metadata?.key?.toLowerCase() === keyName?.toLowerCase()) {
      metadataValue = metadata?.value;
    }
  });
  return metadataValue;
};

/**
 * @description -- this function takes order detail response and
 * return products which have less inventory for order
 * @param orderDetail - Order detail response
 * @return {LessInventoryProductType[]} products with required information
 */
export const getLessInventoryProducts = (orderDetail) => {
  const order = orderDetail?.data;
  const products: ProductType[] = [];
  if (order && order?.lines?.length) {
    order?.lines?.forEach((line) => {
      if (line.quantity > line.variant.stocks[0].quantity) {
        const colorAttributeName = 'color';
        const sizeAttributeName = 'size';
        const variantColors = getAttributeValues(
          line.variant.attributes,
          colorAttributeName,
        );
        const variantSizes = getAttributeValues(
          line.variant.attributes,
          sizeAttributeName,
        );
        products.push({
          id: line.variant.product.id,
          color: variantColors?.length && variantColors[0],
          size: variantSizes?.length && variantSizes[0],
          quantity: line.quantity,
        });
      }
    });
  }
  return products;
};

/**
 * @description this function parses products and returns product ids in an array format
 * @param {ProductType[]} products -- products array
 * @return productIds -- string[]
 */
export const getProductIds = (products: ProductType[]): string[] => {
  return products.map((product) => product.id) as string[];
};

/**
 * @description -- this return os order number form os order data
 * @pre_condition -- this assumes that all orders in os data have same order number
 */
export const extractOsOrderNumber = (orderData: OsOrderResponseInterface) => {
  return orderData.data.orders[0].order_number || null;
};
