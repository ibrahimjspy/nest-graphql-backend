import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderMetadataDto } from 'src/modules/orders/dto/metadata';

const b2bMutation = (orderId: string, input: OrderMetadataDto): string => {
  return gql`
    mutation {
      updateMetadata(
        id: "${orderId}"
        input: ${JSON.stringify(input)
          .replace(/"key"/g, 'key')
          .replace(/"value"/g, 'value')}
      ) {
        item {
          metadata {
            key
            value
          }
        }
      }
    }
  `;
};

const b2cMutation = b2bMutation;

export const updateOrderMetadataMutation = (
  orderId: string,
  input: OrderMetadataDto,
  isB2c = false,
): string => {
  return graphqlQueryCheck(
    b2bMutation(orderId, input),
    b2cMutation(orderId, input),
    isB2c,
  );
};
