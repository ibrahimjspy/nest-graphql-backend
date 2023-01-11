import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (userEmail: string, bundlesId: string[]): string => {
  return gql`
    query {
      bundleStatus(
        Filter: {
          userEmail: "${userEmail}"
          bundleIds: ${JSON.stringify(bundlesId)}
        }
      ) {
        bundleIdsExist {
          bundleId
          checkoutBundleId
        }
        bundleIdsNotExist {
          bundleId
          checkoutBundleId
        }
      }
    }
  `;
};

export const validatebundelIsExist = (
  userEmail: string,
  bundlesIds: string[],
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, bundlesIds),
    federationQuery(userEmail, bundlesIds),
  );
};
