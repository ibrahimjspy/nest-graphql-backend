import { gql } from 'graphql-request';
import { shippingMethodFragment } from './shippingMethod';

export const shippingZoneFragment = gql`
  fragment ShippingZone on ShippingZone {
    id
    shippingMethods {
      ...ShippingMethod
    }
  }
  ${shippingMethodFragment}
`;
