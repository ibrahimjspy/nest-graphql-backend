import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (current_product_ids) => {
  return gql`
    query {
      productMapping(
        filter: {
          currentProductIds: "${current_product_ids}"
        }
      ) {
        currentProductId
        legacyProductId
      }
    }
  `;
};

export const productMappingQuery = (current_product_ids) => {
  return graphqlQueryCheck(
    federationQuery(current_product_ids),
    federationQuery(current_product_ids),
  );
};
