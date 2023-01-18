import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationMutation = (storeId: string) => {
    return gql`
    mutation{
      deactivateMarketplaceShop(id:${storeId}){
        id
      }
    }
  `;
};

export const deactivateStoreMutation = (
  storeId: string
) => {
  return graphqlQueryCheck(
    federationMutation(storeId),
    federationMutation(storeId),
    "true"
  );
};