import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (productIds: string[]) => {
  return gql`
    mutation {
      productBulkDelete(ids: ${JSON.stringify(productIds)}) {
        count
        errors {
          message
        }
      }
    }
  `;
};

const b2cMutation = (productIds: string[]) => {
  return gql`
      mutation {
        productBulkDelete(ids: ${JSON.stringify(productIds)}) {
          count
          errors {
            message
          }
        }
      }
    `;
};

export const deleteBulkProductsMutation = (
  productIds: string[],
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(productIds),
    b2cMutation(productIds),
    isb2c,
  );
};
