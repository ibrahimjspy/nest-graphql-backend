import { gql } from 'graphql-request';
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
              __typename
              id
              name
              description
              slug
              product {
                name
                id
                description
                attributes {
                  attribute {
                    name
                  }
                  values {
                    name
                  }
                }
                metadata {
                  key
                  value
                }
                thumbnail {
                  url
                }
                media {
                  url
                }
              }
              shop {
                id
                name
                email
                url
                madeIn
                minOrder
                description
                about
                returnPolicy
                storePolicy
              }
              productVariants {
                quantity
                productVariant {
                  id
                  name
                  attributes {
                    attribute {
                      name
                    }
                    values {
                      name
                    }
                  }
                  media {
                    url
                  }
                  pricing {
                    price {
                      net {
                        amount
                        currency
                      }
                    }
                    onSale
                    discount {
                      gross {
                        amount
                        currency
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
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
              id
              productVariants {
                quantity
                productVariant{
                  id
                }
                attributes {
                  name
                  value
                }
              }
            }
          }
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};
