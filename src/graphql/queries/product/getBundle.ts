import { gql } from 'graphql-request';
import { bundleDetailsFragment } from 'src/graphql/fragments/bundle';
import { productVariantDetailsFragment } from 'src/graphql/fragments/productVariant';

export const getBundleQuery = (id: string) => {
  return gql`
    query {
      bundle(bundleId: "${id}") {
        ... on BundleViewType {
          ...Bundle
          productVariants {
            quantity
            productVariant{
              ...ProductVariant
            }
          }
        }
      }
    }
    ${bundleDetailsFragment}
    ${productVariantDetailsFragment}
  `;
};
