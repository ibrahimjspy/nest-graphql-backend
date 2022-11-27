import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (product_ids, shop_ids) => {
  return gql`
    query {
      productMapping(
        filter: { productIds: ${JSON.stringify(product_ids)}}
      ) {
        productId
        legacyProductId
      }
      shopMapping(filter: { shopIds: ${JSON.stringify(shop_ids)}}) {
        shopId
        vendorId
      }
    }
  `;
};

export const productMappingQuery = (product_ids, shop_ids) => {
  return graphqlQueryCheck(
    federationQuery(product_ids, shop_ids),
    federationQuery(product_ids, shop_ids),
  );
};
