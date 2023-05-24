import {
  OsOrderItem,
  OsOrderPayloadType,
} from 'src/external/services/osOrder/osOrder.types';
import {
  LessInventoryProductType,
  SaleorCheckoutInterface,
} from './Checkout.utils.type';
import {
  PAYMENT_TYPE,
  PROMOTION_SHIPPING_METHOD_ID,
  SHAROVE_BILLING_ADDRESS,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  STORE_CREDIT,
} from 'src/constants';
import { hash } from 'src/core/utils/helpers';

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
      const variantSizes = getAttributeValues(line.variant.attributes, 'size');
      products.push({
        productId: line.variant.product.id,
        productShopId: getMetadataValue(
          line.variant.product.metadata,
          'vendorId',
        ),
        variantColor: variantColors?.length && variantColors[0],
        variantSize: variantSizes?.length && variantSizes[0],
        quantity: line.quantity,
      });
      // }
    });
  }
  return products;
};

/**
 * @description -- this function takes oranshine shop ids mapping and shop colors to
 * map color against matching os shop id
 * @param {object} osShopMapping - orangeshine shop ids mapping
 * @param {LessInventoryProductType[]} products - orangeshine shop ids mapping
 * @return {object} colors mapping against os shop id
 */
export const transformOsShopMapping = (
  osShopMapping: object,
  products: LessInventoryProductType[],
) => {
  const shopColors = {};
  products.forEach(({ productShopId, variantColor }) => {
    if (
      osShopMapping[productShopId] &&
      shopColors[osShopMapping[productShopId]]
    ) {
      shopColors[osShopMapping[productShopId]] = [
        ...shopColors[osShopMapping[productShopId]],
        variantColor,
      ];
    } else {
      shopColors[osShopMapping[productShopId]] = [variantColor];
    }
  });
  return shopColors;
};

const getPackDetail = (osBundles, productId, productSize, quantity) => {
  let finalPackQuantity = 1;
  let shoeSizeId;
  const bundles = hash(osBundles, 'id');
  if (bundles[productId].is_shoes) {
    const shoePacks = bundles[productId]?.size_chart;
    const shoePacksSizeInfo = [];
    shoePacks.forEach((pack:any) => {
      const matchingSize = pack?.size_chart[productSize];
      if(matchingSize && (matchingSize <= quantity)){
        let quanityDifference = Math.abs(matchingSize - quantity);
        pack.quanityDifference = quanityDifference;
        shoePacksSizeInfo.push(pack)
      }
    })

    const sortedPackSizeInfo = shoePacksSizeInfo.sort((a, b) => a?.quanityDifference - b?.quanityDifference);
    const productQuanityInPack = sortedPackSizeInfo.length && sortedPackSizeInfo[0]?.size_chart[productSize];
    shoeSizeId = sortedPackSizeInfo.length && sortedPackSizeInfo[0]?.id;
    if (productQuanityInPack && quantity > productQuanityInPack) {
      finalPackQuantity = Math.ceil(Math.round(quantity / productQuanityInPack));
    }
    console.log({
      productId,
      productSize,
      quantity,
      finalPackQuantity,
      shoeSizeId
    }, sortedPackSizeInfo)
  
  } else {
    const productQuanityInPack =
      bundles[productId]?.size_chart?.size_chart[productSize];
  
    if (productQuanityInPack && quantity > productQuanityInPack) {
      finalPackQuantity = Math.ceil(Math.round(quantity / productQuanityInPack));
    }
    if (!productQuanityInPack) {
      finalPackQuantity = 0;
    }
  }
  return {
    quantity: finalPackQuantity,
    shoeSizeId
  };
};

/**
 * @description -- this function takes orangeshine order details and transform data
 * for orangeshine order payload
 * @param {object} osShopMapping - orangeshine shop ids mapping
 * @param {LessInventoryProductType[]} products - orangeshine shop ids mapping
 * @param {object} osProductMapping - orangeshine product ids against b2b product ids
 * @param {object} b2bProductMapping - b2b product ids against b2c product ids
 * @param osColorIds - orangeshine color ids against orangeshine shop ids
 * @return {object} payload for orangeshine order
 */
export const transformOsOrderPayload = (
  osShopMapping: object,
  products: LessInventoryProductType[],
  osProductMapping: object,
  b2bProductMapping: object,
  osColorIds,
  OsShippingAddressId: number,
  osBundles,
) => {
  const osOrderItems: OsOrderItem[] = [];
  products.forEach(
    ({ productId, productShopId, variantColor, variantSize, quantity }) => {
      const osProductId = osProductMapping[b2bProductMapping[productId]];
      const osShopId = osShopMapping[productShopId];
      const osColorId = osColorIds.find(
        (color) => color.brand === osShopId && color.name === variantColor,
      )?.id;
        const selectedPackDetail:any = getPackDetail(
          osBundles,
          osProductId,
          variantSize,
          quantity,
        );

      osOrderItems.push({
        item_id: osProductId,
        color_id: osColorId,
        pack_qty: selectedPackDetail?.quantity,
        stock_type: 'in_stock',
        memo: '',
        sms_number: SMS_NUMBER,
        spa_id: OsShippingAddressId,
        spm_name: 'UPS',
        store_credit: STORE_CREDIT,
        signature_requested: SIGNATURE_REQUESTED,
        ...(selectedPackDetail?.shoeSizeId && {
          shoe_size_id: selectedPackDetail?.shoeSizeId
        })
      });
    },
  );
  const uniqueOrderItems: OsOrderItem[] = [];
  osOrderItems.forEach((orderItem) => {
    const isAlreadyExist = uniqueOrderItems.find(
      (item) => ((item.color_id === orderItem.color_id) && (orderItem?.shoe_size_id === item?.shoe_size_id)),
    );
    if(orderItem.pack_qty && orderItem.color_id){
      if (isAlreadyExist) {
        console.log(orderItem.color_id, isAlreadyExist);
        uniqueOrderItems.forEach((item) => {
          if (
            (item.color_id === orderItem.color_id) &&
            (orderItem.pack_qty > item.pack_qty)
          ) {
            item.pack_qty = orderItem.pack_qty;
          }
        });
      } else {
        uniqueOrderItems.push(orderItem);
      }
    }
  });
  const osOrderPayload: OsOrderPayloadType = {
    orders: uniqueOrderItems,
    sharove_order_id: '000',
    stripe_payment_method_id: 'pm_1N8M28Gr7zGKk44AORqD8OHh',
    spa_id: OsShippingAddressId,
    payment_type: PAYMENT_TYPE,
    billing: SHAROVE_BILLING_ADDRESS,
  };

  return osOrderPayload;
};
