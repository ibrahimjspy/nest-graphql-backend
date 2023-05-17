import { gql } from 'graphql-request';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { bundleDetailsFragment } from 'src/graphql/fragments/bundle';
import { BundleCreateDto } from 'src/modules/product/dto/bundle';

export const bundleCreateMutation = (bundleCreateInput: BundleCreateDto) => {
  return gql`
    mutation {
      createBundle(
        Input: ${graphqlObjectTransform(bundleCreateInput)}
      ) {
        ... on BundleViewType {
          ...Bundle
        }
      }
    }
    ${bundleDetailsFragment}
  `;
};
