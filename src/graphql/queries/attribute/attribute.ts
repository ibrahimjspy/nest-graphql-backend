import { gql } from 'graphql-request';
import { attributeDetailsFragment } from 'src/graphql/fragments/attributes';

export const getAttributeQuery = (slug: string) => {
  return gql`
    query {
      attribute(slug: "${slug}") {
        ... Attribute
      }  
    }
    ${attributeDetailsFragment}
  `;
};
