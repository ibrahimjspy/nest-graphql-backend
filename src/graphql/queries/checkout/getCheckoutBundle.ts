import { gql } from 'graphql-request';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
export const getCheckoutBundleQuery = (
  userEmail: string,
  isSelected: any,
  productDetails = true,
  shopDetails = false,
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
  const shopDetailsQuery = shopDetails
    ? `shop{
        id
        fields {
          name
          values
        }
      }`
    : ``;
  return gql`
    query {
      checkoutBundles(
        Filter: { userEmail: "${userEmail}" }
      ) {
        ... on CheckoutBundlesType {
          __typename
          checkoutIds
          userEmail
          checkoutBundles {
            checkoutId
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              isOpenBundle
              ${shopDetailsQuery}
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
