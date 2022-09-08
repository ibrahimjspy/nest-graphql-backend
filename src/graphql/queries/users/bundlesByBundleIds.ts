import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (bundleIds: Array<string>) => {
  return gql`
    query {
      bundles(
        Filter: {
          bundleIds: ${JSON.stringify(bundleIds)}
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
              pricing {
                price {
                  net {
                    amount
                    currency
                  }
                }
                onSale
                discount{
                  gross{
                    amount
                    currency
                  }
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

export const bundlesQuery = (bundleIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(bundleIds),
    federationQuery(bundleIds),
  );
};
