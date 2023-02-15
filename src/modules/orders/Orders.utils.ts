import { roundNumber } from 'src/core/utils/helpers';
import { OrdersListDTO } from './dto/list';
import {
  checkoutBundleInterface,
  orderListInterface,
  orderSaleorInterface,
} from './Orders.utils.types';
import { ShopOrderDto } from './dto/addOrderToShop';

/**
 * It takes a list of bundles and returns a total price of all the bundles
 * @param bundles - The bundles array returned from the query.
 * @returns total price
 */
export const getTotalFromBundles = (bundles) => {
  let total = 0;
  (bundles || []).forEach((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    total += getTotalFromVariants(variants, quantity);
  });
  return roundNumber(total);
};

/**
 * @description - this function returns saleor orders ids from shop object
 * @param shopData - this is data fetched from shop service
 * @returns orderIds = in array of strings[]
 */
export const getOrderIdsFromShopData = (shopData): string[] => {
  const orderIds = [];
  const shopOrders = shopData['orders'];
  shopOrders.map((orderData) => {
    orderIds.push(orderData.orderId);
  });
  return orderIds;
};

/**
 * it validates order list filters and returns string values which can be inserted in gql queries
 * @param filter - ordersList filter such as statuses , paymentStatus, orderIds, customer name
 * @returns object :: orderListInterface
 */
export const orderListFilterValidation = (
  filter: OrdersListDTO,
): orderListInterface => {
  const DEFAULT_START_DATE = '1970-12-26';
  const ordersListFilters: orderListInterface = {};
  const arrayValidation = (filter: string[]) => {
    if (filter) {
      return filter.map ? `[${filter}]` : `[${filter}]`;
    }
    return `[]`;
  };

  ordersListFilters['paymentStatus'] = filter.paymentStatus
    ? arrayValidation(filter.paymentStatus)
    : `[]`;
  ordersListFilters['status'] = filter.statuses
    ? arrayValidation(filter.statuses)
    : `[]`;
  ordersListFilters['orderIds'] = filter.orderIds
    ? JSON.stringify(filter.orderIds)
    : `[]`;
  ordersListFilters['customer'] = filter.customer ? `${filter.customer}` : '';
  ordersListFilters['startDate'] = filter.startDate
    ? filter.startDate
    : DEFAULT_START_DATE;
  ordersListFilters['endDate'] = filter.endDate
    ? filter.endDate
    : `${new Date().toISOString().slice(0, 10)}`;

  return ordersListFilters;
};

/**
 * It takes a list of variants from a bundle and bundle quantity and returns a total price of all the variants in the bundle
 * @param variants - The variants array from a bundle.
 * @param quantity - quantity of the bundle.
 * @returns total price
 */
export const getTotalFromVariants = (variants, quantity) => {
  return (variants || []).reduce(
    (prev, curr) =>
      prev +
      parseFloat(curr?.variant?.pricing?.price?.gross?.amount) *
        parseInt(curr?.quantity) *
        parseInt(quantity),
    0,
  );
};

/**
 * It takes a list of fulfillments from an order and returns total price of bundles in the fulfillment
 * @param fulfillments - The fulfillments array from an order.
 * @returns total price
 */
export const getFulfillmentTotal = (fulfillments) => {
  let total = 0;
  (fulfillments || []).forEach((fulfillment) => {
    total = getTotalFromBundles(fulfillment['fulfillmentBundles']);
  });
  return roundNumber(total);
};

/**
 * It takes a list of bundles and returns a total price of all the bundles
 * @param bundles - The bundles array returned from the query.
 * @returns currency
 */
export const getCurrency = (bundles = []) => {
  const firstBundle = bundles[0];
  const firstVariant = (firstBundle?.bundle?.variants || [])[0];
  return firstVariant?.variant?.pricing?.price?.gross?.currency;
};

/**
 * It takes a list of order bundles and fulfillment status of the order
 * @param bundles - The bundles array returned from the query.
 * @param status - fulfillment status.
 * @returns An array of objects (bundles) with the all the bundle attributes including following properties:
 *   totalAmount: number
 *   fulfillmentStatus: string
 */
export const addStatusAndTotalToBundles = (bundles, status) => {
  return (bundles || []).map((bundleData) => {
    const variants = bundleData?.bundle?.variants;
    const quantity = bundleData?.quantity;
    const total = getTotalFromVariants(variants, quantity);
    return {
      ...bundleData,
      totalAmount: roundNumber(total),
      fulfillmentStatus: status,
    };
  });
};

/**
 * It takes a list of fulfillments and fulfillment status of the order
 * @param fulfillments - The fulfillments array returned from the query.
 * @param status - fulfillment status.
 * @returns An array of objects (bundles) with the all the fulfillmentBundle attributes including following properties:
 *   totalAmount: number
 *   fulfillmentStatus: string
 */
export const getFulFillmentsWithStatusAndBundlesTotal = (
  fulfillments,
  status,
) => {
  return (fulfillments || []).map((fulfillment) => {
    (fulfillment?.fulfillmentBundles || []).map((fulfillmentBundle) => {
      const variants = fulfillmentBundle?.bundle?.variants;
      const quantity = fulfillmentBundle?.quantity;
      const total = getTotalFromVariants(variants, quantity);
      return {
        ...fulfillmentBundle,
        fulfillmentStatus: status,
        totalAmount: roundNumber(total),
      };
    });
    return {
      ...fulfillment,
      totalAmount: getTotalFromBundles(fulfillment['fulfillmentBundles']),
    };
  });
};

/**
 *   returns pending orders from all orders
 *   @params all orders
 */
export const getPendingOrders = (orders) => {
  return orders.filter((order) => order.status !== 'FULFILLED');
};

/**
 * transforms single Saleor order against each shop with line ids mapped against variant ids
 * @links getOrdersLineIds, getSelectedShippingMethods
 * @author Muhammad Ibrahim
 * @params checkoutData : marketplace checkout data containing bundles and shipping information
 * @params orderInfo : Saleor order information containing line ids of order
 */
export const getOrdersByShopId = (
  checkoutData: checkoutBundleInterface,
  orderInfo: orderSaleorInterface,
): ShopOrderDto[] => {
  // utility functions
  // appends single shop order to all shop orders
  const addShopOrderToAllOrders = (
    allOrders: object,
    shopOrder: object,
    shopId: string,
  ) => {
    allOrders[`${shopId}`] = allOrders[`${shopId}`]?.length
      ? [...allOrders[`${shopId}`], shopOrder]
      : [shopOrder];
  };

  const allOrders: object = {};
  (checkoutData.checkoutBundles || []).map((checkoutBundle) => {
    const shopOrder: object = {};
    const bundle: object = {};
    const shopId = checkoutBundle?.bundle?.shop?.id;

    //adds bundle to shop object
    bundle['bundleId'] = checkoutBundle?.bundle?.id;
    bundle['quantity'] = checkoutBundle?.quantity;
    bundle['orderlineIds'] = getOrdersLineIds(
      checkoutBundle?.bundle?.productVariants,
      orderInfo,
    );

    //add additional information to object
    shopOrder['shippingMethodId'] = getOrderShippingMethods(
      checkoutData['selectedMethods'],
      shopId,
    );
    shopOrder['shopId'] = checkoutBundle?.bundle?.shop?.id;
    shopOrder['orderId'] = orderInfo['id'];

    shopOrder['bundle'] = bundle;
    addShopOrderToAllOrders(allOrders, shopOrder, shopId);
  });
  return filterOrdersByShop(allOrders);
};

/**
 * @returns order line ids against bundle variants
 * @links getOrdersByShop, <dependency>
 * @author Muhammad Ibrahim
 * @params bundleVariants : containing bundle and variant ids
 * @params orderInfo : containing orderLines
 */
const getOrdersLineIds = (bundleVariants, orderInfo: object) => {
  const lineIds = [];
  (bundleVariants || []).map((bundleVariant) => {
    orderInfo['lines'].map((line) => {
      if (bundleVariant?.productVariant?.id === line?.variant?.id) {
        lineIds.push(line.id);
      }
    });
  });
  return lineIds;
};

/**
 * returns selected shipping methods of given marketplace checkout mapped against shop id
 * @fallback if there is no shipping method id against that shop id , return first selected method
 * @author Muhammad Ibrahim
 * @links getOrdersByShop function = () => object
 * @params selectedMethods : shipping methods of all shops : object
 * @params shopId : string
 */
const getOrderShippingMethods = (selectedMethods, shopId: string) => {
  return (
    selectedMethods.find((shippingMethod) => shippingMethod.shop.id === shopId)
      ?.method.shippingMethodTypeId ||
    selectedMethods[0].method.shippingMethodTypeId
  );
};

/**
 * @description - this method filters marketplace orders and returns an array of objects with shop order details
 * @links getOrdersByShop function = () => object
 * @params marketplaceOrders : object containing shop ids as keys and shop order objects as values
 */
export const filterOrdersByShop = (marketplaceOrders): ShopOrderDto[] => {
  const shopOrders: any = [];
  Object.values(marketplaceOrders).map(async (marketplaceOrders: any[]) => {
    const shopOrderObject = {};
    (marketplaceOrders || []).map((shopOrder) => {
      shopOrderObject['shippingMethodId'] = shopOrder['shippingMethodId'];
      shopOrderObject['shopId'] = shopOrder['shopId'];
      shopOrderObject['orderId'] = shopOrder['orderId'];
      shopOrderObject[`marketplaceOrderBundles`] = shopOrderObject[
        `marketplaceOrderBundles`
      ]?.length
        ? [...shopOrderObject[`marketplaceOrderBundles`], shopOrder['bundle']]
        : [shopOrder['bundle']];
    });
    shopOrders.push(shopOrderObject);
  });
  return shopOrders;
};
