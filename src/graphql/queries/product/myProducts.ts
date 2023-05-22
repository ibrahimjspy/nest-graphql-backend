import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { categoryFragment } from 'src/graphql/fragments/category';
import { mediaFragment } from 'src/graphql/fragments/media';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { myProductsDTO } from 'src/modules/shop/dto/myProducts';

const b2cQuery = (productIds, filter: myProductsDTO): string => {
  return gql`
    query {
      products(${validatePageFilter(
        filter,
      )}, channel: "default-channel", filter: { isAvailable: true, ids: ${JSON.stringify(
    productIds,
  )} search:"${filter.search || ''}" }) {
        totalCount
        pageInfo {
          ... PageInfo
        }
        edges {
          node {
            ... Product
            thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
              url
            }
            metadata {
              key
              value
            }
            category {
              ... Category
              ancestors(first: 5) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
            media {
              ... Media
            }
            variants {
              id
              attributes {
                ... Attribute
              }
              pricing {
                ... Price
              }
            }
          }
        }
      }
    }
    ${productDetailsFragment}
    ${attributeFragment}
    ${pricingFragment}
    ${pageInfoFragment}
    ${categoryFragment}
    ${mediaFragment}
  `;
};
const b2bQuery = b2cQuery;

export const getMyProductsQuery = (
  variantsIds: string[],
  filter: myProductsDTO,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bQuery(variantsIds, filter),
    b2cQuery(variantsIds, filter),
    isb2c,
  );
};
