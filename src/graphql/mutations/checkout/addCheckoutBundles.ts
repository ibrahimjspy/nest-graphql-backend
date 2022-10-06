import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          checkoutId: "${checkoutId}",
          userId: "${userId}",
          bundles: ${JSON.stringify(bundles)
            .replace(/"bundleId"/g, 'bundleId')
            .replace(/"isSelected"/g, 'isSelected')
            .replace(/"quantity"/g, 'quantity')}
        }
      ) {
        ... on CheckoutBundlesType {
          checkoutId
          userId
          bundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              name
              description
              slug
              variants {
                quantity
                variant {
                  id
                  name
                  sku
                  attributes {
                      attribute {
                          name
                      }
                      values {
                          name
                      }
                  }
                  product {
                      name
                      id
                      thumbnail {
                        url
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
          }
      }
        }
        ... on ResultError {
            message
            errors
        }
    }
  }
  `;
};

export const addCheckoutBundlesMutation = (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, userId, bundles),
    federationQuery(checkoutId, userId, bundles),
  );
};
