import { GQL_EDGES } from 'src/constants';
import {
  BundlesResponseType,
  BundlesType,
  MarketplaceProductsResponseType,
  ProductDetailType,
  ProductOriginEnum,
} from './Product.types';

/**
 * returns array of bundle ids
 * @params bundles: array with full bundle objects
 */
export const getBundleIds = (bundles: Array<{ bundleId: string }>) => {
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
export const getProductIds = (productsData: {
  edges: Array<{ node: { id: string } }>;
}) => {
  return [...new Set(productsData.edges?.map((edge) => edge?.node?.id))];
};

/**
 * @description this function parses elastic search response and stored b2b and b2c id in hashMap
 * @params elasticSearchData -- exact format as elastic search
 * @warn please send data without parsing it
 * @return idsMapping - returns hasp map with b2b id as key and b2c id as value-- Map<string, string>
 */
export const storeB2cMapping = (
  elasticSearchData: Array<{
    shr_b2b_product_id: { raw: string };
    shr_b2c_product_id: { raw: string };
  }>,
): Map<string, string> => {
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
 * @params idsMapping -- Map<string, string>
 * @param productOrigin - Origin of the products (default: 'B2B'). - product for which you want to get mapping for -- passing B2B will return b2c mappings against it
 * @warn please do not remove edges from your productsData object
 * @return productsData - this productsData also include b2c product id as well
 */
export const mergeB2cMappingsWithProductData = (
  idsMapping: Map<string, string>,
  productsData,
  productOrigin = ProductOriginEnum.B2B,
) => {
  productsData?.edges?.map((product) => {
    if (productOrigin === ProductOriginEnum.B2B) {
      product.node.b2cProductId = idsMapping.get(product.node.id) || null;
    } else {
      product.node.b2bProductId = idsMapping.get(product.node.id) || null;
    }
  });
  return productsData;
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

/**
 * Combines product detail and bundles data into a unified structure.
 * @param productDetail - The product detail data.
 * @param bundles - The bundles data.
 * @returns The combined data.
 */
export function makeGetBundlesResponse(
  productDetail: ProductDetailType,
  bundles: BundlesType,
): BundlesResponseType {
  /**
   * Combines a product variant from the product detail data with a given variant ID.
   * @param variantId - The ID of the variant to combine.
   * @returns The combined product variant, or null if not found.
   */
  const combineProductVariant = (variantId) => {
    return productDetail.data.product.variants.find((v) => v.id === variantId);
  };

  /**
   * Combines an array of product variants with their quantities from the bundles data.
   * @param productVariants - The array of product variants to combine.
   * @returns The combined product variants with quantities.
   */
  const combineProductVariants = (productVariants) =>
    productVariants
      .map(({ productVariant, quantity }) => {
        const combinedVariant = combineProductVariant(productVariant.id);
        return combinedVariant
          ? { quantity, productVariant: { ...combinedVariant } }
          : null;
      })
      .filter(Boolean);

  /**
   * Combines a bundle node from the bundles data with the product detail data.
   * @param bundleNode - The bundle node to combine.
   * @returns The combined bundle node.
   */
  const combineBundleNode = ({ node: bundleNode }) => {
    const productVariants = combineProductVariants(bundleNode.productVariants);

    return {
      node: {
        ...bundleNode,
        product: {
          ...productDetail.data.product,
          variants: productDetail.data.product.variants.map((variant) => ({
            ...variant,
          })),
        },
        productVariants: [...productVariants],
      },
    };
  };

  const combinedData = {
    data: {
      edges: bundles.data.edges.map(combineBundleNode),
    },
  };

  return combinedData;
}

/**
 * @description this function parses elastic search response and stored b2b and b2c id in hashMap
 * @params elasticSearchData -- exact format as elastic search
 * @warn please send data without parsing it
 * @return idsMapping - returns hasp map with b2c id as key and b2b id as value-- Map<string, string>
 */
export const storeB2bMapping = (
  elasticSearchData: Array<{
    shr_b2b_product_id: { raw: string };
    shr_b2c_product_id: { raw: string };
  }>,
): Map<string, string> => {
  const idsMapping: Map<string, string> = new Map();
  elasticSearchData?.map((mapping) => {
    const b2bId = mapping?.shr_b2b_product_id?.raw;
    const b2cId = mapping?.shr_b2c_product_id?.raw;
    idsMapping.set(b2cId, b2bId);
  });
  return idsMapping;
};
