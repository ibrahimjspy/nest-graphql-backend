import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { removeKeysQuoutes } from 'src/core/utils/helpers';

const federationQuery = (
  checkoutId: string,
  userId: string,
  bundles: Array<{
    bundleId: string;
    quantity: number;
    isSelected?: boolean;
    lines?: Array<string>;
  }>,
) => {
  return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          checkoutId: "${checkoutId}",
          userId: "${userId}",
          bundles: ${removeKeysQuoutes(bundles)}
        }
      ) {
        ... on CheckoutBundlesType {
          totalAmount
          subTotal
          taxes
          discounts
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
                      media {
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
