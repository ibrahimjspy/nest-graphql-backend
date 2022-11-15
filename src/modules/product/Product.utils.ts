import { GQL_EDGES_KEY } from 'src/constants';

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
  return [
    ...new Set(variants[GQL_EDGES_KEY].map((edge) => edge?.node?.product?.id)),
  ];
};
