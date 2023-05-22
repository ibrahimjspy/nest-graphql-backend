import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { metadataFragment } from 'src/graphql/fragments/attributes';
import { addressFragment } from 'src/graphql/fragments/checkout/shipping/shippingAddress';

const b2bQuery = () => {
  return gql`
    query {
      me {
        id
        firstName
        lastName
        email
      }
    }
  `;
};

const b2cQuery = () => {
  return gql`
    query {
      me {
        isStaff
        userPermissions {
          name
          code
        }
        id
        firstName
        lastName
        email
        checkoutIds
        metadata {
          ...Metadata
        }
        addresses {
          ...Address
        }
        defaultBillingAddress {
          ...Address
        }
        defaultShippingAddress {
          ...Address
        }
      }
    }
    ${addressFragment}
    ${metadataFragment}
  `;
};

export const userInformationQuery = () => {
  return graphqlQueryCheck(b2bQuery(), b2cQuery());
};
