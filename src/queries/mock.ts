import { gql } from 'graphql-request';

// Mock Queries for testing use cases
// -------->>
// Product Card query for an api hosted at graphqleditor.com

export const mockProductCard = () => {
  return gql`
    query ProductCard {
      color_variant
      description
      sku
      product_cost
      id
      image
      slug
      resale_price
      title
    }
  `;
};

export const aniQuery = () => {
  return gql`
    query Query {
      Page {
        media {
          siteUrl
          title {
            english
            native
          }
          description
        }
      }
    }
  `;
};
export const paramQuery = (id: number) => {
  return gql`
    query Query {
      characters(page: ${id}, filter: { name: "Morty" }) {
        info {
          count
        }
        results {
          name
        }
      }
      location(id: 1) {
        id
      }
      episodesByIds(ids: [1, 2]) {
        id
      }
    }
  `;
};
