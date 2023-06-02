import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { bundleDetailsFragment } from 'src/graphql/fragments/bundle';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
import { mediaFragment } from 'src/graphql/fragments/media';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { productVariantDetailsFragment } from 'src/graphql/fragments/productVariant';
import { shopDetailsFragment } from 'src/graphql/fragments/shop';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { GetBundlesDto } from 'src/modules/product/dto/product.dto';

export const getBundlesQuery = (filter: GetBundlesDto) => {
  const getProductDetails = filter.getProductDetails || false;
  const productVariantIds = filter.productVariants || null;
  const bundleIds = filter.bundleIds || null;
  const productId = filter.productId ? `"${filter.productId}"` : null;
  const pagination = validatePageFilter(filter);

  if (getProductDetails) {
    return gql`
    query {
      bundles(
        Paginate: {${pagination}}
        Filter: {
          productVariantIds: ${JSON.stringify(productVariantIds)}
          productId: ${productId}
          bundleIds: ${JSON.stringify(bundleIds)}
        }
      ) {
        ... on BundleConnectionType {
          edges {
            node {
              ... Bundle
              product {
                ... Product
                attributes {
                  ... Attribute
                }
                metadata {
                  ... Metadata
                }
                thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
                  url
                }
                media {
                  ... Media
                }
              }
              shop {
                ... Shop
              }
              productVariants {
                quantity
                productVariant {
                  ... ProductVariant
                  attributes {
                    ... Attribute
                  }
                  media {
                    ... Media
                  }
                  pricing {
                    ... Price
                  }
                }
              }
            }
          }
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${resultErrorFragment}
    ${shopDetailsFragment}
    ${attributeFragment}
    ${mediaFragment}
    ${productDetailsFragment}
    ${productVariantDetailsFragment}
    ${pricingFragment}
    ${bundleDetailsFragment}
  `;
  }
  return gql`
    query {
      bundles(
        Paginate: {${pagination}}
        Filter: {
            productVariantIds: ${JSON.stringify(productVariantIds)}
            productId: ${productId}
            bundleIds: ${JSON.stringify(bundleIds)}
          }
      ) {
        ... on BundleConnectionType {
          edges {
            node {
              ... Bundle
              shop {
                ... Shop
              }
              productVariants {
                quantity
                attributes {
                  name
                  value
                }
                productVariant{
                  id
                }
              }
            }
          }
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${resultErrorFragment}
    ${shopDetailsFragment}
    ${bundleDetailsFragment}
  `;
};
