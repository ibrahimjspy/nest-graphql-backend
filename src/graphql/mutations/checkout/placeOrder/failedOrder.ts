import { gql } from 'graphql-request';
import { FailedOrderInterface } from 'src/graphql/types/checkout.type';

export const saveFailedOrderMutation = (
  failedOrderData: FailedOrderInterface,
) => {
  const { email, source, orderId, orderPayload, exception, errorShortDesc } =
    failedOrderData;
  return gql`
    mutation {
      saveFailedOrder(
        input: {
          email: "${email}"
          source: "${source}"
          orderId: "${orderId}"
          exception: ${JSON.stringify(exception)}
          errorShortDesc: "${errorShortDesc}"
          orderPayload: ${JSON.stringify(JSON.stringify(orderPayload))}
        }
      ) {
        isSuccess
      }
    }
  `;
};
