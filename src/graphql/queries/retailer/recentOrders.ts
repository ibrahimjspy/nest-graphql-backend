import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (email: string) => {
  return gql`
    query{
      orders(
        first: 5
        filter: {
          customer: "${email}"
        }
        sortBy: {
          direction: DESC
          field: LAST_MODIFIED_AT
        }
      )
      {
        edges{
          node{
            number
            created
            status
            total{
              gross{
                currency
                amount
              }
            }
          }
        }
      }
    }
  `;
};

export const recentOrdersQuery = (email: string) => {
  return graphqlQueryCheck(
    federationQuery(email),
    federationQuery(email),
  );
};
