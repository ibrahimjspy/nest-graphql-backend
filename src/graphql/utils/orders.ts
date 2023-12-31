import { DEFAULT_WAREHOUSE_ID } from 'src/constants';
import { orderLineDTO } from 'src/modules/orders/dto/fulfill';

/**
 *   transforms orderIds array into a string which can be used in graphql query
 *   @params orders ids []
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const orderIdsTransformer = (orders): string => {
  return orders.map((order) => {
    return `"${order}"`;
  });
};

/**
 *   transforms bundles and lineIds from array to valid graphql strings
 *   @params order bundles []
 *   @returns graphql order bundles in string format
 */
export const orderBundlesTransformer = (order): any => {
  if (order?.marketplaceOrderBundles) {
    return JSON.stringify(order['marketplaceOrderBundles'])
      .replace(/"bundleId"/g, 'bundleId')
      .replace(/"quantity"/g, 'quantity')
      .replace(/"orderlineIds"/g, 'orderlineIds')
      .replace(/"lineIds"/g, 'lineIds');
  }
  return null;
};

/**
 *   @author Muhammad Ibrahim
 *   @description takes pageInfo of graphql response and returns endCursor if there is a next page
 *   otherwise returns null || falsy value which rejects a promise
 *   @params pageInfo with hasNextPage and endCursor values
 *   @returns endCursor || null (if no next page)
 */
export const hasNextPage = (pageInfo) => {
  if (pageInfo['hasNextPage']) {
    return pageInfo['endCursor'];
  }
  return null;
};

/**
 *   @author Muhammad Ibrahim
 *   @description takes n number of orders in an array
 *   loops over them and return order ids of orders that have status marked as 'RETURNED"
 *   @params ordersArray containing all orders with order status and ids
 *   @returns array of returned order ids
 */
export const filterReturnedOrderIds = (
  orderResponse,
  returnStatus = null,
): string[] => {
  const ids = [];
  orderResponse.map((order) => {
    const orderStatus = order?.node?.status;
    if (returnStatus) {
      return orderStatus == returnStatus && ids.push(order.node.id);
    }
    if (!returnStatus) {
      if (orderStatus == 'RETURNED' || orderStatus == 'PARTIALLY_RETURNED') {
        return ids.push(order.node.id);
      }
    }
  });
  return ids;
};

/**
 *   transforms orderLines from array to valid graphql strings
 *   @params order_lines []
 *   @returns graphql order lines in string format
 */
export const orderLinesTransformer = (orderLines): any => {
  return JSON.stringify(orderLines)
    .replace(/"orderLineId"/g, 'orderLineId')
    .replace(/"quantity"/g, 'quantity')
    .replace(/"replace"/g, 'replace');
};

/**
 *   @author Muhammad Ibrahim
 *  @links - this is used in order fulfillment
 *   @description transforms order lines input to a string to work with graphql
 */
export const orderLinesFulfillTransformer = (
  orderLines: orderLineDTO[],
): string => {
  const linesArray = [];
  const warehouseId = DEFAULT_WAREHOUSE_ID;
  orderLines.map((order) => {
    linesArray.push({
      orderLineId: order.orderLineId,
      stocks: { warehouse: warehouseId, quantity: order.quantity },
    });
  });
  return JSON.stringify(linesArray)
    .replace(/"orderLineId"/g, 'orderLineId')
    .replace(/"stocks"/g, 'stocks')
    .replace(/"warehouse"/g, 'warehouse')
    .replace(/"quantity"/g, 'quantity');
};

/**
 *   transforms order return input to valid graphql strings
 *   @params orderReturnInput
 *   @returns graphql order return input in string format
 */
export const orderReturnInputTransformer = (orderReturnInput): any => {
  return JSON.stringify(orderReturnInput)
    .replace(/"fulfillmentLines"/g, 'fulfillmentLines')
    .replace(/"orderLines"/g, 'orderLines')
    .replace(/"refund"/g, 'refund')
    .replace(/"includeShippingCosts"/g, 'includeShippingCosts')
    .replace(/"fulfillmentLineId"/g, 'fulfillmentLineId')
    .replace(/"orderLineId"/g, 'orderLineId')
    .replace(/"quantity"/g, 'quantity')
    .replace(/"replace"/g, 'replace');
};
