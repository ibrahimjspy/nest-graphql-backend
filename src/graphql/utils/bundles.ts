import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { UpdateBundleDto } from 'src/modules/checkout/cart/dto/cart';

/**
 *  transforms bundles to update checkout bundles format
 * @deprecated -- this will not be needed when we move from v1 cart apis to v2
 */
export const updateBundlesTransformer = (
  bundles: UpdateBundleDto[],
): string => {
  const transformedVariants: Array<{
    proVariantOldId: string;
    proVariantNewId: string;
    quantity: number;
  }> = [];
  bundles.map((bundle) => {
    transformedVariants.push({
      proVariantOldId: bundle.oldVariantId,
      proVariantNewId: bundle.newVariantId,
      quantity: bundle.quantity,
    });
  });
  return graphqlObjectTransform(transformedVariants);
};
