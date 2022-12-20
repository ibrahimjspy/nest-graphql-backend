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
