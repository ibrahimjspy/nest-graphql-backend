import { gql } from 'graphql-request';
import { metadataFragment } from '../../attributes';
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
    metadata {
      key
      value
    }
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
    metadata {
      ...Metadata
    }
  }
  ${metadataFragment}
`;

export const selectedShippingMethodsFragment = gql`
  fragment CheckoutShippingMethods on CheckoutShippingMethodType {
    method {
      id
      shippingMethodId
      shippingMethodTypeId
    }
    shop {
      id
      name
    }
  }
`;
