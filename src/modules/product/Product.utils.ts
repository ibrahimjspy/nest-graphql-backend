import { GQL_EDGES } from 'src/constants';
import { MarketplaceProductsResponseType } from './Product.types';

/**
 * returns array of bundle ids
 * @params bundles: array with full bundle objects
 */
export const getBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.bundleId);
};

/**
 * Given a list of variants, return a list of unique product IDs.
 * @param variants - The array of variants returned from the GraphQL query.
 * @returns An array of unique product ids
 */
export const getProductIdsByVariants = (variants) => {
  const edges: any[] = variants[GQL_EDGES];
  return [...new Set(edges?.map((edge) => edge?.node?.product?.id))];
};

/**
 * @description this function parses products object and returns unique product ids in an array format
 * @params productsData -- exact format as Saleor
 * @warn please do not remove edges from your productsData object
 * @return productIds -- string[]
 */
export const getProductIds = (productsData) => {
  return [...new Set(productsData.edges?.map((edge) => edge?.node?.id))];
};

/**
 * @description this function parses elastic search response and stored b2b and b2c id in hashMap
 * @params elasticSearchData -- exact format as elastic search
 * @warn please send data without parsing it
 * @return idsMapping - returns hasp map with b2b id as key and b2c id as value-- Map<string, string>
 */
export const storeB2cMapping = (elasticSearchData): Map<string, string> => {
  const idsMapping: Map<string, string> = new Map();
  elasticSearchData?.map((mapping) => {
    const b2bId = mapping?.shr_b2b_product_id?.raw;
    const b2cId = mapping?.shr_b2c_product_id?.raw;
    idsMapping.set(b2bId, b2cId);
  });
  return idsMapping;
};

/**
 * @description this function takes b2c and b2b ids hashmap and adds its b2c id against b2b in products object
 * @params productsData -- exact format as Saleor
 * @params idsMapping -- Map<string, string> -- Map< b2bId, b2cId >
 * @warn please do not remove edges from your productsData object
 * @return productsData - this productsData also include b2c product id as well
 */
export const addB2cIdsToProductData = (
  idsMapping: Map<string, string>,
  productsData,
) => {
  productsData?.edges?.map((product) => {
    product.node.b2cProductId = idsMapping.get(product.node.id) || null;
  });
  return productsData;
};

/**
 * to comply with frontend contract this functon returns an object that has product as key and products list as value
 * @params productsList: array of products
 */
export const makeProductListResponse = (productsList) => {
  return { products: productsList };
};

/**
 * @description this function parses shop productIds response and returns unique product ids in an array format
 * @params productIdsReponse -- exact format as Saleor
 * @warn please do not remove edges from your productIdsReponse object
 * @return productIds -- string[]
 */
export const getShopProductIds = (
  productIdsResponse: MarketplaceProductsResponseType,
): string[] => {
  return [
    ...new Set(productIdsResponse.edges?.map((edge) => edge?.node?.productId)),
  ] as string[];
};

/**
 * Get array length
 * @param {Array} arr - paramter of object type
 * @returns {number} return the length of the array.
 */
export const isEmptyArray = (arr) => {
  return arr?.length;
};
