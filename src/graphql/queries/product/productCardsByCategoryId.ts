import { gql } from 'graphql-request';

export const productCardByCategoryIdQuery = () => {
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