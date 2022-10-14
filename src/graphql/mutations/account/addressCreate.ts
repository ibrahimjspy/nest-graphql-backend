import { gql } from 'graphql-request';
import { AddressCreateInputType } from './addressCreate.type';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (userId: string, address: AddressCreateInputType) => {
  return gql`
    mutation {
      addressCreate(
        userId: ${userId}
        input: ${JSON.stringify(address)}
      ) {
        user {
          id
          addresses {
            id
            firstName
            lastName
            city
            country {
              code
              country
            }
            isDefaultShippingAddress
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

export const addressCreateMutation = (
  userId: string,
  address: AddressCreateInputType,
) => {
  return graphqlQueryCheck(
    federationQuery(userId, address),
    federationQuery(userId, address),
  );
};
