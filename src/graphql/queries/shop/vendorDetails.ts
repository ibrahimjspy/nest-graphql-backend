import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (vendorId: string): string => {
  return gql`
        query {
        marketplaceShop(filter: { id: "${vendorId}" }) {
            id
            name
            products {
             id
            }
            fields {
            name
            values
           }
        }
     }
  `;
};

const b2cQuery = (vendorId: string): string => {
  return gql`
        query {
        marketplaceShop(filter: { id: "${vendorId}" }) {
            id
            name
            products {
             id
            }
            fields {
            name
            values
           }
        }
     }
  `;
};

export const vendorDetailsQuery = (vendorId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(vendorId), b2cQuery(vendorId), isb2c);
};
