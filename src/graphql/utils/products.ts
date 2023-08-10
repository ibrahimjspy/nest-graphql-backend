import { ProductFilterDto } from 'src/modules/product/dto';
import { ProductSortFilters } from 'src/modules/product/dto/product.dto';

/**
 * returns filtering for product attribute
 * @params filters: product filters we use for filtering product which includes sorting
 */
export const getProductAttributeFilter = (filter: ProductFilterDto) => {
  return `
  attributes:[
    ${
      filter.color
        ? `{slug:"availableColors", values:${JSON.stringify(filter.color)}},`
        : ''
    }
    ${
      filter.patterns
        ? `{slug:"patterns", values:${JSON.stringify(filter.patterns)}},`
        : ''
    }
      ${
        filter.styles
          ? `{slug:"styles", values:${JSON.stringify(filter.styles)}},`
          : ''
      }
      ${
        filter.isSharoveFulfillment
          ? `{slug:"issharovefulfillment", boolean:${filter.isSharoveFulfillment}},`
          : ''
      }
      ${
        filter.vendorId?.length > 1
          ? `{slug:"shopid",values:${JSON.stringify(filter.vendorId)}},`
          : ''
      }
    ]
    `;
};

/**
 * returns sorting mechanism for product
 * @params filters: product filters we use for filtering product which includes sorting
 */
export const getProductsSortBy = (filter: ProductFilterDto) => {
  if (!filter.sortBy && !filter.popularityAttributeId) {
    return `sortBy: { field: CREATED_AT, direction: DESC}`;
  }
  return `sortBy:
    ${
      filter.sortBy == ProductSortFilters.HIGHEST_PRICE
        ? `{ field: PRICE, direction: DESC}`
        : ''
    }
    ${
      filter.sortBy == ProductSortFilters.LOWEST_PRICE
        ? `{ field: PRICE, direction: ASC}`
        : ''
    }
    ${
      filter.sortBy == ProductSortFilters.NEWEST
        ? `{ field: CREATED_AT, direction: DESC}`
        : ''
    } 
    ${
      filter.popularityAttributeId
        ? `{ attributeId: "${filter.popularityAttributeId}", direction: DESC}`
        : ''
    } 
    `;
};

/**
 * returns vendor id filter in case if vendor id is one,
 * @deprecated -- use attribute filter in products
 */
export const getVendorIdMetadataFilter = (filter: ProductFilterDto) => {
  return filter.vendorId?.length < 2
    ? ` metadata: [{ key: "vendorId", value: "${filter.vendorId}" }]`
    : '';
};
