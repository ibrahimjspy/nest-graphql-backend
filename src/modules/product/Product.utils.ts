/**
 * returns array of bundle ids
 * @params bundles: array with full bundle objects
 */
export const getBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.bundleId);
};
