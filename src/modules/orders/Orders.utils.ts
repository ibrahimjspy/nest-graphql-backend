import { OrdersListDTO } from './dto/list';
import {
  checkoutBundleInterface,
  orderListInterface,
  orderSaleorInterface,
} from './Orders.utils.types';
import { ShopOrderDto } from './dto/addOrderToShop';

/**
 * @description - this function returns saleor orders ids from shop object
 * @param shopData - this is data fetched from shop service
 * @returns orderIds = in array of strings[]
 */
export const getOrderIdsFromShopData = (shopData): string[] => {
  const shopOrders = shopData['orders'];
  return shopOrders.map((orderData) => orderData.orderId);
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
    shopOrder['shippingMethodId'] = orderInfo?.deliveryMethod.id;
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
export const getOrderShippingMethods = (selectedMethods, shopId: string) => {
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
