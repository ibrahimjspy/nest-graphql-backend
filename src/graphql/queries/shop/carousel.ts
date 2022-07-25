import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQuery';

const federationQuery = () => {
  console.log('federation called');
  // query linking with backend
  return gql`
    query {
      categories(first: 2) {
        edges {
          node {
            name
            id
            slug
            children(first: 2) {
              edges {
                node {
                  name
                  id
                  slug
                  children(first: 2) {
                    edges {
                      node {
                        name
                        id
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};

const mockQuery = () => {
  console.log('mock called');
  // query linking with mock server
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
export const carouselQuery = graphqlQueryCheck(federationQuery(), mockQuery());
