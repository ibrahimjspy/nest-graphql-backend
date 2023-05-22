import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shopDetailsFragment } from 'src/graphql/fragments/shop';

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
        ... Shop
      }
    }
    ${shopDetailsFragment}
  `;
};

export const updateMyVendorsMutation = (
  shopId: string,
  vendorIds: string[],
) => {
  return graphqlQueryCheck(
    b2bMutation(shopId, vendorIds),
    b2bMutation(shopId, vendorIds),
  );
};
