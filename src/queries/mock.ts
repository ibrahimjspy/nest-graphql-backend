import { gql } from 'graphql-request';

export const rickQuery = (page: number) => {
  return gql`
      query Query {
        characters(page: ${page}, filter: { name: "Morty" }) {
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
