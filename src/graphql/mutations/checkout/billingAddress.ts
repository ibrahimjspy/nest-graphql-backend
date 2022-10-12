import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId, addressDetails) => {
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

export const billingAddressMutation = (checkoutId, addressDetails) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, addressDetails),
    federationQuery(checkoutId, addressDetails),
  );
};
