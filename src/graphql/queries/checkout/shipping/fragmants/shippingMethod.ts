import { gql } from 'graphql-request';

export const shippingMethodFragment = gql`
  fragment ShippingMethod on ShippingMethod {
    id
    name
    description
    maximumDeliveryDays
    minimumDeliveryDays
  }
`;
