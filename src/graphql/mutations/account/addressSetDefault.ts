import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { AddressTypeEnum } from 'src/graphql/enums/address';
import { addressFragment } from 'src/graphql/fragments/checkout/shipping/shippingAddress';

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
            ... Address
          }
        }
        errors {
          code
          field
          message
        }
      }
    }
    ${addressFragment}
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
