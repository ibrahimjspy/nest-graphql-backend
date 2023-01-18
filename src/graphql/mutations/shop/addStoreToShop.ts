import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationMutation = (shopId: string, storeIds: string[]) => {
    return gql`
    mutation {
      updateMarketplaceShop(
        id: ${shopId}
        input: {
          fields: [{ name: "storefrontIds", newValues: ${JSON.stringify(storeIds)} }]
        }
      ) {
        id
      }
    }
  `;
};

export const addStoreToShopMutation = (
  shopId: string,
  storeIds: string[]
) => {
  return graphqlQueryCheck(
    federationMutation(shopId, storeIds),
    federationMutation(shopId, storeIds)
  );
};