import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2cMutation = (storeId: string) => {
  return gql`
    mutation{
      deactivateMarketplaceShop(id:${storeId}){
        id
      }
    }
  `;
};

export const deactivateStoreMutation = (storeId: string) => {
  return graphqlQueryCheck(b2cMutation(storeId), b2cMutation(storeId), true);
};
