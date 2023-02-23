import { gql } from 'graphql-request';

export const bundleStatusQuery = (
  userEmail: string,
  bundlesId: string[],
): string => {
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
