import { gql } from 'graphql-request';
import { AddressInput } from '../../types/address.type';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (addressId: string, address: AddressInput) => {
  return gql`
    mutation {
      addressUpdate(
        id: "${addressId}"
        input: {
          firstName: "${address.firstName}",
          lastName: "${address.lastName}",
          streetAddress2: "${address.streetAddress2}",
          streetAddress1: "${address.streetAddress1}",
          companyName: "${address.companyName}",
          city: "${address.city}",
          cityArea: "${address.cityArea}",
          country: ${address.country},
          phone: "${address.phone}",
          postalCode: "${address.postalCode}"
        }
      ) {
        address {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          cityArea
          postalCode
          country {
            code
            country
          }
          countryArea
          phone
          isDefaultShippingAddress
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

export const addressUpdateMutation = (
  addressId: string,
  address: AddressInput,
) => {
  return graphqlQueryCheck(
    federationQuery(addressId, address),
    federationQuery(addressId, address),
  );
};
