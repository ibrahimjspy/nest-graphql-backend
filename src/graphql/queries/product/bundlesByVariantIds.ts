import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (variantIds: Array<string>) => {
  return gql`
    query {
      bundles(
        Filter: {
          variantIds: ${JSON.stringify(variantIds)}
        }
      ) {
        ... on BundleViewType {
          __typename
          id
          name
          description
          slug
          variants {
            quantity
            variant {
              id
              name
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
              }
            }
          }
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};

export const productBundlesQuery = (variantIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(variantIds),
    federationQuery(variantIds),
  );
};
