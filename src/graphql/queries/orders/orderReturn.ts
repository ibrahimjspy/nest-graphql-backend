import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderReturnDTO } from 'src/modules/orders/dto/order-returns.dto';
import { orderReturnInputTransformer } from 'src/graphql/utils/orders';

const federationQuery = (payload: OrderReturnDTO): string => {
  return gql`
    mutation {
      orderFulfillmentReturnProducts(
        order:  "${payload.id}",
        input: ${orderReturnInputTransformer(payload.input)}
      ) {
        errors {
          ...OrderError
          __typename
        }
        order {
          id
          __typename
        }
        replaceOrder {
          id
          __typename
        }
        __typename
      }
    }
    fragment OrderError on OrderError {
      code
      field
      addressType
      message
      orderLines
      __typename
    }
  `;
};

export const orderReturnFulfillmentQuery = (payload: OrderReturnDTO) => {
  return graphqlQueryCheck(federationQuery(payload), federationQuery(payload));
};
