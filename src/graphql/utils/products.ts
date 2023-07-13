import { ProductFilterDto } from 'src/modules/product/dto';

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
          ? `{slug:"isSharoveFulfillment", boolean:${filter.isSharoveFulfillment}},`
          : ''
      }
    ]
    `;
};
