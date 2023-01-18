import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (shopId: string, storeIds: string[]) => {
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
    b2bMutation(shopId, storeIds),
    b2bMutation(shopId, storeIds)
  );
};