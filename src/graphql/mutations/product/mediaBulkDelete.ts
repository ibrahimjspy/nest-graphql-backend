import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (mediaIds: string[]) => {
  return gql`
    mutation {
      productMediaBulkDelete(ids: ${JSON.stringify(mediaIds)}) {
        count
        errors {
          message
          code
          field
        }
      }
    }
  `;
};

const b2cMutation = b2bMutation;
export const deleteBulkMediaMutation = (mediaIds: string[], isb2c = false) => {
  return graphqlQueryCheck(b2bMutation(mediaIds), b2cMutation(mediaIds), isb2c);
};
