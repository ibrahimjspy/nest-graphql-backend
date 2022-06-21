import { gql } from 'graphql-request';

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
