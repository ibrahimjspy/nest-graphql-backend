import { gql } from 'graphql-request';
import { preAuthTransactionInput } from 'src/constants';

export const preAuthTransactionMutation = ({
  checkoutId,
  paymentIntentId,
  amount,
}) => {
  const { status, type, currency, eventStatus, eventName, availableActions } =
    preAuthTransactionInput;
  return gql`
    mutation {
      transactionCreate(
        id: "${checkoutId}"
        transaction: {
          status: "${status}"
          type: "${type}"
          reference: "${paymentIntentId}"
          availableActions: ${availableActions}
          amountAuthorized: { currency: "${currency}", amount: ${amount} }
        }
        transactionEvent: {
          status: ${eventStatus}
          name: "${eventName}"
          reference: "${paymentIntentId}"
        }
      ) {
        transaction {
          id
          authorizedAmount {
            __typename
            currency
            amount
          }
          chargedAmount {
            __typename
            currency
            amount
          }
        }
        errors {
          __typename
          message
          code
          field
        }
      }
    }
  `;
};
