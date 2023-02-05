/**
 * this util adds product list fetched from saleor to product store by matching through id
 * @returns composite response
 */
export const addProductListToStoredProducts = (
  productStoreResponse,
  productList,
) => {
  productStoreResponse?.edges.map((product, key) => {
    productStoreResponse.edges[key] = { ...productList?.edges[key] };
  });
  return productStoreResponse;
};
