import { gql } from 'graphql-request';
const shippingMethodChannelListingFragment = gql`
  fragment ShippingMethodChannelListing on ShippingMethodChannelListing {
    channel {
      id
    }
    price {
      amount
    }
  }
`;

export const shippingMethodFragment = gql`
  fragment ShippingMethod on ShippingMethodType {
    channelListings {
      ...ShippingMethodChannelListing
    }
    id
    name
    description
    maximumDeliveryDays
    minimumDeliveryDays
  }
  ${shippingMethodChannelListingFragment}
`;

export const checkoutShippingMethodFragment = gql`
  fragment ShippingMethod on ShippingMethod {
    id
    name
    description
    maximumDeliveryDays
    minimumDeliveryDays
    price {
      amount
    }
  }
`;