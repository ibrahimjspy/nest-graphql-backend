import { gql } from 'graphql-request';

export const pricingFragment = gql`
  fragment Price on VariantPricingInfo {
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

export const checkoutPricingFragment = gql`
  fragment Price on VariantPricingInfo {
    price {
      net {
        amount
        currency
      }
    }
    onSale
    discount {
      gross {
        amount
        currency
      }
    }
  }
`;
