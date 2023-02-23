import { PushToStoreDto } from './dto/products';

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

/**
 * this method parses product store list which should be push to store and returns product ids
 * @returns list of product ids -- string[]
 */
export const getIdsFromProductStoreList = (input: PushToStoreDto) => {
  const productIds = [];
  input.products.map((product) => {
    productIds.push(product.id);
  });
  return productIds;
};
