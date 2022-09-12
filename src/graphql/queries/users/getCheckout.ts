import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  // query linking with backend
  return gql`
  query {
    marketplaceCheckout(
        userId: "${userId}"
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
                madeIn
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

export const getCheckoutQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
