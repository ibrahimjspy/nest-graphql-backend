import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id): string => {
  return gql`
    query {
      collection(id: "${id}", channel: "default-channel") {
        products(first: 100, filter: { categories: ["Q2F0ZWdvcnk6Mzk="] }) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
};
const mockQuery = () => {
  return gql`
    query {
      products {
        image
        title
        description
        id
        slug
        color_variant
        sku
        resale_price
        product_cost
      }
    }
  `;
};

export const productCardsByCategoryId = (id) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
