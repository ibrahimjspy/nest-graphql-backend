import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (shopId: string, vendorIds: string[]) => {
  return gql`
    mutation {
      updateMarketplaceShop(
        id: ${shopId}
        input: {
          fields: [{ name: "myvendors", newValues: ${JSON.stringify(
            vendorIds,
          )} }]
        }
      ) {
        id
        name
        email
        url
        about
        description
        fields{
          name
          values
        }
      }
    }
  `;
};

export const addVendorsToShopMutation = (
  shopId: string,
  vendorIds: string[],
) => {
  return graphqlQueryCheck(
    b2bMutation(shopId, vendorIds),
    b2bMutation(shopId, vendorIds),
  );
};
