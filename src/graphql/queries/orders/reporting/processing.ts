import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { metadataType } from 'src/graphql/types/order.type';
const b2cQuery = (metadata: metadataType): string => {
  return gql`
    query {
      orders(
        filter: {
          metadata: ${graphqlObjectTransform(metadata)}
          status: [
            READY_TO_FULFILL
            READY_TO_CAPTURE
            PARTIALLY_FULFILLED
            UNFULFILLED
          ]
        }
      ) {
        totalCount
      }
    }
  `;
};

const b2bQuery = b2cQuery;

export const getProcessingOrdersCountQuery = (
  metadata: metadataType,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(metadata), b2cQuery(metadata), isB2C);
};
