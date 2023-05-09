import { gql } from 'graphql-request';

export const addressFragment = gql`
  fragment Address on Address {
    id
    firstName
    lastName
    streetAddress1
    streetAddress2
    phone
    companyName
    city
    postalCode
    countryArea
    country {
      code
      country
    }
    isDefaultShippingAddress
  }
`;
