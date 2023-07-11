import { gql } from 'graphql-request';
import { DEFAULT_MEDIA_SIZE } from 'src/constants';

export const mediaFragment = gql`
  fragment Media on ProductMedia {
    url(size: ${DEFAULT_MEDIA_SIZE})
  }
`;
