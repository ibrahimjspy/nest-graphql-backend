import { gql } from 'graphql-request';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
export const getCheckoutBundleQuery = (
  userEmail: string,
  isSelected: any,
  productDetails = true,
) => {
  if (productDetails) {
    return gql`
    query {
      checkoutBundles(
        Filter: { userEmail: "${userEmail}",isSelected: ${isSelected} }
      ) {
        ... on CheckoutBundlesType {
          ... CheckoutBundles
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${checkoutBundlesFragment}
    ${resultErrorFragment}
  `;
  }
  return gql`
    query {
      checkoutBundles(
        Filter: { userEmail: "${userEmail}" }
      ) {
        ... on CheckoutBundlesType {
          __typename
          checkoutId
          userEmail
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              productVariants {
                quantity
                productVariant {
                  id             
                }
              }
            }
          }
        }
        ... on ResultError {
          __typename
          message
          errors
        }
      }
    }
  `;
};
