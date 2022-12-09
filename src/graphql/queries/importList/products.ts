import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

export const getImportedProductsQuery = (
  shopId: string,
  filter: ProductFilterDto,
) => {
  const pageFilter = validatePageFilter(filter);
  return gql`
      query {
        importProducts(
            Filter: {
              shopId: "${shopId}"
            }
            Paginate: {
              ${pageFilter}
            }
            SortBy: {
              direction: ASC,
              field: CREATED_AT
            }
        ) {
            __typename
            ... on ImportProductConnectionType {
            totalCount
            edges {
                node {
                shopId
                productVariantIds
                product {
                    id
                    name
                    slug
                    thumbnail {
                      url
                    }
                    media {
                      url
                    }
                    defaultVariant {
                      sku
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
