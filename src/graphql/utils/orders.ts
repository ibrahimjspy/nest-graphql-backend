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
export const orderBundlesTransformer = (orders): any => {
  return orders.map((order) => {
    return JSON.stringify(order['bundle'])
      .replace(/"bundleId"/g, 'bundleId')
      .replace(/"quantity"/g, 'quantity')
      .replace(/"orderlineIds"/g, 'orderlineIds')
      .replace(/"lineIds"/g, 'lineIds');
  });
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
export const filterReturnedOrderIds = (orderResponse) => {
  const ids = [];
  orderResponse.map((order) => {
    if (order?.node?.status == 'RETURNED') {
      ids.push(order.node.id);
    }
  });
  return ids;
};
