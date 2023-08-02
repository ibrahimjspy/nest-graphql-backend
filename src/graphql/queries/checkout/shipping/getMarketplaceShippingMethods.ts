import { gql } from 'graphql-request';

export const getMarketplaceShippingMethodsQuery = (
  userEmail: string,
): string => {
  return gql`
    query {
      checkoutBundles(Filter: { userEmail: "${userEmail}" }) {
        ... on CheckoutBundlesType {
          checkoutBundles {
            checkoutId
            bundle {
              shop {
                shippingMethods {
                  id
                  shippingMethodId
                  shippingMethodTypeId
                }
              }
            }
          }
        }
      }
    }
  `;
};
