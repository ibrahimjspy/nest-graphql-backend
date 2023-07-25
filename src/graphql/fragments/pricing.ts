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

export const checkoutPricingFragmentV2 = gql`
  fragment VariantPrice on VariantPricingInfo {
    price {
      net {
        amount
        currency
      }
      gross {
        currency
        amount
      }
    }
    onSale
  }
`;

export const taxedPricingFragment = gql`
  fragment Price on TaxedMoney {
    tax {
      amount
    }
    currency
    gross {
      amount
    }
    net {
      amount
    }
  }
`;

/**
 * List of price information in channels for the product.

  Requires one of the following permissions: AUTHENTICATED_APP, AUTHENTICATED_STAFF_USER.
  fragment name == ChannelPricing
 */
export const channelListingPricingFragment = gql`
  fragment ChannelPricing on ProductVariantChannelListing {
    id
    price {
      amount
      currency
    }
  }
`;
