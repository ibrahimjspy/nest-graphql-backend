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
        ? `{slug:"color", values:${JSON.stringify(filter.color)}},`
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
    ]
    `;
};

/**
 * returns sorting mechanism for product
 * @params filters: product filters we use for filtering product which includes sorting
 */
export const getProductsSortBy = (filter: ProductFilterDto) => {
  if (!filter.sortBy) {
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
    `;
};
