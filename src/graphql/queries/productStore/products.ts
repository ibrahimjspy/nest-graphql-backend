import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { getStoredProductsDTO } from 'src/modules/productStore/dto/products';

export const getStoredProductsQuery = (
  shopId: string,
  filter: getStoredProductsDTO,
) => {
  const productIds = JSON.stringify(filter.productIds) || '[]';
  const pageFilter = validatePageFilter(filter);
  return gql`
      query {
        storedProducts(
            Filter: {
              shopId: "${shopId}"
              productIds:${productIds}
            }
            Paginate: {
              ${pageFilter}
            }
        ) {
            __typename
            ... on StoredProductConnectionType {
            totalCount
            edges {
                node {
                shop {
                  id
                }
                productVariantIds
                product {
                    id
                    name
                    description
                    slug
                    thumbnail {
                      url
                    }
                    media {
                      url
                    }
                    defaultVariant {
                      sku
                      id
                      attributes {
                        attribute {
                          name
                        }
                        values {
                          name
                        }
                      }
                      pricing {
                        price {
                          gross {
                            currency
                            amount
                          }
                        }
                      }
                    }
                category{
                    name
                    id
                    ancestors(first:5){
                    edges{
                        node{
                        id
                        name
                        }
                    }
                    }
                    }
                    variants{
                        id
                        attributes{
                          attribute{
                            name
                          }
                          values{
                            name
                          }
                        }
                    }
                }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            }
        }
        }
  `;
};
