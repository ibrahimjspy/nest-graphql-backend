import { gql } from 'graphql-request';

export const vendorCategoriesQuery = (vendorId: string): string => {
  const vendorFilter = `filter: { metadata: { key: "vendorId", value: "${vendorId}" } }`;
  return gql`
    query {
      categories(first: 20, level: 1) {
        edges {
          node {
            id
            name
            parent {
              products(
                ${vendorFilter}
              ) {
                totalCount
              }
            }
            products(${vendorFilter}) {
              totalCount
            }
          }
        }
      }
    }
  `;
};
