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
 * this method parses list of objects and return ids from list
 * @returns list of ids -- string[]
 */
export const getIdsFromList = (list, key = 'id') => {
  const ids = [];
  list.map((item) => {
    ids.push(item[`${key}`]);
  });
  return ids;
};
