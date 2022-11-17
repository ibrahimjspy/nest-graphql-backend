/**
 *   transforms orderIds array into a string whcih can be used in graphql query
 *   @params orders ids []
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const orderIdsTransformer = (orders): string => {
  return orders.map((order) => {
    return `"${order}"`;
  });
};
