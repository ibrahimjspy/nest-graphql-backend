import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationMutation = (shopId: string, storeId: string) => {
    return gql`
    mutation {
      updateMarketplaceShop(
        id: ${shopId}
        input: {
          fields: [{ name: "storefrontIds", newValues: ["${storeId}"] }]
        }
      ) {
        id
      }
    }
  `;
};

export const addStoreToShopMutation = (
  shopId: string,
  storeId: string
) => {
  return graphqlQueryCheck(
    federationMutation(shopId, storeId),
    federationMutation(shopId, storeId)
  );
};