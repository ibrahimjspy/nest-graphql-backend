import { gql } from 'graphql-request';
import { addressCreateInputType } from './addressCreate.type';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string, address: addressCreateInputType) => {
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
  address: addressCreateInputType,
) => {
  return graphqlQueryCheck(
    federationQuery(userId, address),
    federationQuery(userId, address),
  );
};
