import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { addressFragment } from 'src/graphql/fragments/checkout/shipping/shippingAddress';

const federationQuery = (userId: string) => {
  return gql`
    query {
      user (
        id: "${userId}"
      ) {
        id
        email
        addresses {
          ... Address
        }
      }
    }
    ${addressFragment}
  `;
};

export const userAddressesByIdQuery = (userId: string) => {
  return graphqlQueryCheck(federationQuery(userId), federationQuery(userId));
};
