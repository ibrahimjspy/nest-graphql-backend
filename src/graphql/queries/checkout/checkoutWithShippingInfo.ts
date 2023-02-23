import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  return gql`
    query {
      checkout(
          id: "${checkoutId}",
      ) {
        shippingAddress {
          id,
          streetAddress1,
          streetAddress2,
          city,
          countryArea,
          postalCode
        }
      }
    }
  `;
};

export const checkoutWithShippingInfoQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
