import { gql } from 'graphql-request';

export const checkoutShippingAddressUpdateMutation = (
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
      checkoutShippingAddressUpdate (
        id: "${checkoutId}",
        shippingAddress: {
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
          shippingAddress {
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
