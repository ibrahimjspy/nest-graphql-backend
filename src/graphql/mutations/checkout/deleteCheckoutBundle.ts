import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutID: string) => {
  return gql`
    mutation {
      disableUserCartSession(
        Input: {
          checkoutId: "${checkoutID}"
        }
      ) {
        ... on CheckoutBundlesType {
          __typename
          totalAmount
          subTotal
          taxes
          discounts
          checkoutId
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              name
              description
              slug
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
              productVariants {
                quantity
                productVariant {
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
               
                  pricing {
                    price {
                      net {
                        amount
                        currency
                      }
                    }
                    onSale
                    discount {
                      gross {
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
                shippingMethods {
                  id
                  shippingMethodId
                  shippingMethodTypeId
                }
              }
            }
          }
          selectedMethods {
            method {
              id
              shippingMethodId
              shippingMethodTypeId
            }
            shop {
              id
              name
            }
          }
        }
        __typename
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};

export const deleteCheckoutBundlesMutation = (checkoutID: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutID),
    federationQuery(checkoutID),
  );
};
