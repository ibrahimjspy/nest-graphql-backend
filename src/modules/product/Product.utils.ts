import { GQL_EDGES } from 'src/constants';

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
 * If the user doesn't provide a category, then categories filter will be applied otherwise not
 * @param category - This is the category id
 * @returns A string
 */
export const validateCategoryFilter = (category: string) => {
  if (category) {
    return `["${category}"]`;
  } else {
    return `[]`;
  }
};
