import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (vendorId: string): string => {
  return gql`
        query {
        marketplaceShop(filter: { id: "${vendorId}" }) {
            id
            name
            productVariants {
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
            productVariants {
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

export const vendorDetailsQuery = (vendorId: string, isB2C = '') => {
  return graphqlQueryCheck(b2bQuery(vendorId), b2cQuery(vendorId), isB2C);
};
