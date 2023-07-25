import { gql } from 'graphql-request';
import { DEFAULT_MEDIA_SIZE } from 'src/constants';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { metadataFragment } from 'src/graphql/fragments/attributes';
import { validatePageFilter } from 'src/graphql/utils/pagination';

export const collectionsQuery = (pagination: PaginationDto): string => {
  return gql`
    query {
      collections(${validatePageFilter(pagination)}) {
        edges {
          node {
            id
            name
            description
            metadata {
              ... Metadata
            }
            backgroundImage(size: ${DEFAULT_MEDIA_SIZE}) {
              url
              alt
            }
          }
        }
      }
    }
    ${metadataFragment}
  `;
};
