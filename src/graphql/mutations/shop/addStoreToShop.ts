import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (
  shopId: string,
  storeIds: string[],
  storeUrls: string[],
) => {
  return gql`
    mutation {
      updateMarketplaceShop(
        id: ${shopId}
        input: {
          fields: [{ name: "storefrontIds", newValues: ${JSON.stringify(
            storeIds,
          )} }, { name: "storefronturls", newValues: ${JSON.stringify(
    storeUrls,
  )} }]
        }
      ) {
        id
      }
    }
  `;
};

export const addStoreToShopMutation = (
  shopId: string,
  storeIds: string[],
  storeUrls: string[],
) => {
  return graphqlQueryCheck(
    b2bMutation(shopId, storeIds, storeUrls),
    b2bMutation(shopId, storeIds, storeUrls),
  );
};
