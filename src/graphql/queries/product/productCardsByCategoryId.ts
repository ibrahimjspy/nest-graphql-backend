import { gql } from 'graphql-request';
import { graphqlQueryCheck } from '../../../public/graphqlQueryToggle';

const federationQuery = () => {
  return gql`
    query {
      collection(id: "Q29sbGVjdGlvbjo0", channel: "default-channel") {
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

export const productCardsByCategoryId = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
