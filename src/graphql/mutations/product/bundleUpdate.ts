import { gql } from 'graphql-request';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { bundleDetailsFragment } from 'src/graphql/fragments/bundle';
import { UpdateOpenPackDto } from 'src/modules/checkout/cart/dto/cart';

export const bundleUpdateMutation = (updateBundle: UpdateOpenPackDto) => {
  return gql`
    mutation {
      updateBundle(
        Input: {
          bundleId: "${updateBundle.bundleId}"
          isOpenBundle: true
          productVariants: ${graphqlObjectTransform(updateBundle.variants)
            .replace('oldVariantId', 'proVariantOldId')
            .replace('newVariantId', 'proVariantNewId')}
        }
      ) {
        ... on BundleViewType {
          ...Bundle
        }
        ... on ResultError {
          errors
          message
        }
      }
    }
    ${bundleDetailsFragment}
  `;
};

export const updateBundlePricingMutation = (id: string) => {
  return gql`
    mutation {
      updateBundlesPricing(bundles: [{ bundleId: "${id}" }]) {
        ... on ResultData {
          message
        }
      }
    }
  `;
};
