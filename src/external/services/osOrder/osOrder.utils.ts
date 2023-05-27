import { OsBundlesType, OsOrderItem, ProductType } from './osOrder.types';

/**
 * @deprecated Need to optimze
 * @description -- this function get orangeshine closest shoes size against given product qunatity
 * from orangeshine shoes packs
 * @param osProductBundle - Orangeshine product bundle details
 * @param {ProductType} product - B2C product details
 * @return {object} closest shoe size based on product quantity
 */
export const getClosestShoePackSize = (
  osProductBundle,
  product: ProductType,
) => {
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
export const getSelectedPackQuantity = (
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
    finalPackQuantity = Math.ceil(bundleMinOrderAmount / (productsInPack * singleProductPrice));
  }
  return finalPackQuantity;
};

/**
 * @description -- this function remove duplicate orangeshine order items
 * and returns maximum packs quantity order items for duplicate order items
 * @param osOrderItems - Orangeshine order items
 * @return orangeshine unique order items
 */
export const getUniqueOrderItems = (osOrderItems: OsOrderItem[]) => {
  const uniqueOrderItems: OsOrderItem[] = [];
  osOrderItems.forEach((orderItem) => {
    const isAlreadyExist = uniqueOrderItems.find(
      (item) =>
        item.color_id === orderItem.color_id &&
        orderItem?.shoe_size_id === item?.shoe_size_id,
    );
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
 * @description -- this function transform object data to javascript Map format
 * @param dataObject - data in object format
 * @return data in Map format
 */
export const transformObjectToMap = (dataObject: object) => {
  const dataMap = new Map();
  Object.keys(dataObject).forEach((key) => {
    dataMap.set(key, dataObject[key]);
  });
  return dataMap;
};
