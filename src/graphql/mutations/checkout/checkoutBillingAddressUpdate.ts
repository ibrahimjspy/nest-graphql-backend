import { gql } from 'graphql-request';

export const checkoutBillingAddressUpdateMutation = (
  checkoutId,
  addressDetails,
) => {
  const {
    country,
    countryArea,
    firstName,
    lastName,
    streetAddress1,
    streetAddress2,
    phone,
    companyName,
    postalCode,
    city,
  } = addressDetails;
  return gql`
    mutation {
      checkoutBillingAddressUpdate (
        id: "${checkoutId}",
        billingAddress: {
          country: ${country},
          countryArea: "${countryArea || ''}",
          firstName: "${firstName}",
          lastName: "${lastName}",
          streetAddress1: "${streetAddress1}",
          streetAddress2: "${streetAddress2 || ''}",
          phone: "${phone || ''}",
          companyName: "${companyName || ''}",
          postalCode: "${postalCode}",
          city: "${city}",
        }
      ) {
        checkout {
          id
          billingAddress {
            firstName
            lastName
            streetAddress1
            streetAddress2
            phone
            companyName
            city
            postalCode
            country {
              country
              code
            }
          }
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
};
