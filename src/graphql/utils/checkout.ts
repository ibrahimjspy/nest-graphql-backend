/**
 *  transforms bundles to add checkout bundles format
 * @deprecated -- this will not be needed when we move from v1 cart apis to v2
 */
export const addCheckoutBundlesTransformer = (
  bundles: Array<{ bundleId: string; quantity: number }>,
): string => {
  return JSON.stringify(bundles)
    .replace(/"bundleId"/g, 'id')
    .replace(/"quantity"/g, 'quantity');
};
