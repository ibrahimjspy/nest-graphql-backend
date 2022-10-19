import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { AddressTypeEnum } from 'src/graphql/enums/address';

const federationQuery = (
  userId: string,
  addressId: string,
  type: AddressTypeEnum,
) => {
  return gql`
    mutation {
      addressSetDefault(
        userId: "${userId}"
        addressId: "${addressId}"
        type: ${type}
      ) {
        user {
          id
          addresses {
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
        }
        errors {
          code
          field
          message
        }
      }
    }
  `;
};

export const addressSetDefaultMutation = (
  userId: string,
  addressId: string,
  type: AddressTypeEnum = AddressTypeEnum.SHIPPING,
) => {
  return graphqlQueryCheck(
    federationQuery(userId, addressId, type),
    federationQuery(userId, addressId, type),
  );
};
