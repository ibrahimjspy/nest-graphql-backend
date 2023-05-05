import { gql } from 'graphql-request';

export const pricingFragment = gql`
  fragment Price on Price {
    price {
      gross {
        currency
        amount
      }
      net {
        currency
        amount
      }
    }
  }
`;
