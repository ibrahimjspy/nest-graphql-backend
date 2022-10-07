import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';
import { DEFAULT_CHANNEL } from 'src/constants';

const federationQuery = (productIds: Array<string>): string => {
  return gql`
    query {
      products(
        filter: {
          ids: ${JSON.stringify(productIds)}
        }
        first: ${productIds.length}
        channel: "${DEFAULT_CHANNEL}"
      ){
        edges{
          node{
            variants{
              id
            }
          }
        }
      }
    }
  `;
};

export const variantsIdsByProductIdsQuery = (productIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(productIds),
    federationQuery(productIds),
  );
};
