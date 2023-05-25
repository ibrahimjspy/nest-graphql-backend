import {
  OsBundlesType,
  OsOrderItem,
  OsOrderPayloadType,
} from 'src/external/services/osOrder/osOrder.types';
import {
  MetadataType,
  OsOrderResponseInterface,
  OsOrderTranformType,
  ProductType,
  SaleorCheckoutInterface,
  attributeType,
} from './Checkout.utils.type';
import {
  PAYMENT_TYPE,
  PROMOTION_SHIPPING_METHOD_ID,
  SHAROVE_BILLING_ADDRESS,
  SHAROVE_STRIPE_PAYMENT_METHOD,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  STORE_CREDIT,
} from 'src/constants';
import { hash } from 'src/core/utils/helpers';
import { ProductIdsMappingType } from 'src/external/endpoints/b2bMapping.types';

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
      // if (line.quantity > line.variant.stocks[0].quantity) {
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
      // }
    });
  }
  return products;
};

/**
 * @description -- this function get orangeshine closest shoes size against given product qunatity
 * from orangeshine shoes packs
 * @param osProductBundle - Orangeshine product bundle details
 * @param {ProductType} product - B2C product details
 * @return {object} closest shoe size based on product quantity
 */
const getClosestShoePackSize = (osProductBundle, product: ProductType) => {
  const shoeSizePacks = osProductBundle?.size_chart;
  const matchingShoeSizes = [];
  shoeSizePacks?.forEach((shoeSizePack: any) => {
    // Todo: Need to verify product size names with orangehine
    const shoeSizeQuantity =
      shoeSizePack?.size_chart[product?.size] ||
      shoeSizePack?.size_chart[product?.size?.replace('/', '.')];
    if (shoeSizeQuantity && shoeSizeQuantity <= product.quantity) {
      const quanityDifference = Math.abs(shoeSizeQuantity - product.quantity);
      shoeSizePack.quanityDifference = quanityDifference;
      matchingShoeSizes.push(shoeSizePack);
    }
  });

  const sortedByQuantityDifference = matchingShoeSizes.sort(
    (a, b) => a?.quanityDifference - b?.quanityDifference,
  );
  const closestShoePackSize =
    sortedByQuantityDifference.length && sortedByQuantityDifference[0];
  return closestShoePackSize;
};

/**
 * @description -- this function calculate orangeshine packs quanity based on
 * given b2c product quantity
 * @param osProductBundle - Orangeshine product bundle details
 * @param product - B2C product details
 * @return orangeshine packs quantity
 */
const getSelectedPackQuantity = (
  osProductBundle: OsBundlesType,
  product: ProductType,
) => {
  let finalPackQuantity = 1;
  let productQuanityInPack = 0;
  const bundleMinOrderAmount =
    osProductBundle?.brand?.fulfillment?.min_order_amount;
  const singleProductPrice = osProductBundle?.price?.price;
  const productsInPack = osProductBundle.size_chart.total;

  if (osProductBundle?.is_shoes) {
    const closestShoePackSize = getClosestShoePackSize(
      osProductBundle,
      product,
    );
    // Todo: Need to verify product size names with orangehine
    productQuanityInPack =
      closestShoePackSize?.size_chart[product?.size] ||
      closestShoePackSize?.size_chart[product?.size?.replace('/', '.')];
  } else {
    // Todo: Need to verify product size names with orangehine
    productQuanityInPack =
      osProductBundle?.size_chart?.size_chart[product?.size] ||
      osProductBundle?.size_chart?.size_chart[product?.size?.replace('/', '.')];
  }

  if (productQuanityInPack && product.quantity > productQuanityInPack) {
    finalPackQuantity = Math.ceil(
      Math.round(product.quantity / productQuanityInPack),
    );
  } else if (!productQuanityInPack) {
    finalPackQuantity = 0;
  }

  const finalPackAmount =
    finalPackQuantity * productsInPack * singleProductPrice;
  const isOrderMinAmountFulfilled = bundleMinOrderAmount <= finalPackAmount;
  if (!isOrderMinAmountFulfilled) {
    finalPackQuantity = Math.ceil(
      Math.round(bundleMinOrderAmount / (productsInPack * singleProductPrice)),
    );
  }
  return finalPackQuantity;
};

/**
 * @description -- this function remove duplicate orangeshine order items
 * and returns maximum packs quantity order items for duplicate order items
 * @param osOrderItems - Orangeshine order items
 * @return orangeshine unique order items
 */
const getUniqueOsOrderItems = (osOrderItems: OsOrderItem[]) => {
  const uniqueOrderItems: OsOrderItem[] = [];
  osOrderItems.forEach((orderItem) => {
    const isAlreadyExist = uniqueOrderItems.find(
      (item) =>
        item.color_id === orderItem.color_id &&
        orderItem?.shoe_size_id === item?.shoe_size_id,
    );
    if (!orderItem.pack_qty || !orderItem.color_id) return;
    if (isAlreadyExist) {
      uniqueOrderItems.forEach((item) => {
        if (
          item.color_id === orderItem.color_id &&
          orderItem.pack_qty > item.pack_qty
        ) {
          item.pack_qty = orderItem.pack_qty;
        }
      });
    } else {
      uniqueOrderItems.push(orderItem);
    }
  });
  return uniqueOrderItems;
};

/**
 * @description -- this function takes orangeshine order details and transform data
 * for orangeshine order payload
 * @param b2cProducts - B2C products list for order on orangeshine
 * @param osProductMapping - orangeshine product ids against b2b product ids
 * @param b2bProductMapping - b2b product ids against b2c product ids
 * @param OsShippingAddressId - orangeshine user shipping address id
 * @param osProductsBundles - orangeshine bundles array against orangeshine product ids
 * @return payload for orangeshine order
 */
export const transformOsOrderPayload = ({
  orderNumber,
  b2cProducts,
  osProductMapping,
  b2bProductMapping,
  OsShippingAddressId,
  osProductsBundles,
}: OsOrderTranformType) => {
  const osOrderItems: OsOrderItem[] = [];
  b2cProducts?.forEach((product) => {
    const osProductId = osProductMapping.get(b2bProductMapping.get(product.id));
    const osBundles = hash(osProductsBundles, 'id');
    const osProductBundle = osBundles[osProductId];
    const osProductBundleColors = hash(osProductBundle?.colors, 'name');
    const selectedProductColorId =
      osProductBundleColors[product?.color]?.color_id;
    const selectedPackQuantity = getSelectedPackQuantity(
      osProductBundle,
      product,
    );

    if (selectedProductColorId && selectedPackQuantity) {
      osOrderItems.push({
        item_id: osProductId,
        color_id: selectedProductColorId,
        pack_qty: selectedPackQuantity,
        stock_type: 'in_stock',
        memo: '',
        sms_number: SMS_NUMBER,
        spa_id: OsShippingAddressId,
        spm_name: 'UPS',
        store_credit: STORE_CREDIT,
        signature_requested: SIGNATURE_REQUESTED,
        ...(osProductBundle?.is_shoes && {
          shoe_size_id: getClosestShoePackSize(osProductBundle, product)?.id,
        }),
      });
    }
  });

  const osOrderPayload: OsOrderPayloadType = {
    orders: getUniqueOsOrderItems(osOrderItems),
    sharove_order_id: orderNumber,
    stripe_payment_method_id: SHAROVE_STRIPE_PAYMENT_METHOD,
    spa_id: OsShippingAddressId,
    payment_type: PAYMENT_TYPE,
    billing: SHAROVE_BILLING_ADDRESS,
    order_type: 'D2C',
  };

  return osOrderPayload;
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
