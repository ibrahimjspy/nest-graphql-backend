/**
 *   @author Muhammad Ibrahim
 *   @description takes products object returned from product variant array and returns unique product ids from it
 *   @params productIdsArray including edges
 *   @returns unique array of product ids
 */
export const getUniqueProductIds = (productIdsArray) => {
  const productIds = [];
  productIdsArray.map((productId) => {
    productIds.push(productId.node.product.id);
  });
  return [...new Set(productIds)];
};
