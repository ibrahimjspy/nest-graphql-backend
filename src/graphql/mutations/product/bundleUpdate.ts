import { gql } from 'graphql-request';
import { bundleDetailsFragment } from 'src/graphql/fragments/bundle';
import { updateBundlesTransformer } from 'src/graphql/utils/bundles';
import { UpdateOpenPackDto } from 'src/modules/checkout/cart/dto/cart';

export const bundleUpdateMutation = (updateBundle: UpdateOpenPackDto) => {
  return gql`
    mutation {
      updateBundle(
        Input: {
          bundleId: "${updateBundle.bundleId}"
          isOpenBundle: true
          productVariants: ${updateBundlesTransformer(updateBundle.variants)}
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
