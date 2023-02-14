import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
  checkoutBundleIds: Array<string>,
  userEmail: string,
) => {
  return gql`
    mutation {
      deleteCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          checkoutBundleIds: ${JSON.stringify(checkoutBundleIds)}
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
          message
          data
        }
      }
    }
  `;
};

export const deleteCheckoutBundlesMutation = (
  checkoutBundleIds: Array<string>,
  userEmail: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutBundleIds, userEmail),
    federationQuery(checkoutBundleIds, userEmail),
  );
};
