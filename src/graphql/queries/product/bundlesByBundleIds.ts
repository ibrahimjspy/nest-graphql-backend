import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

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
          shop {
            id
            name
            email
            url
            madeIn
            minOrder
            description
            about
            returnPolicy
            storePolicy
          }
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

export const productBundlesByBundleIdQuery = (bundleIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(bundleIds),
    federationQuery(bundleIds),
  );
};
