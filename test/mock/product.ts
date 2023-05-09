export const mockProductData = {
  edges: [
    {
      node: {
        id: 'UHJvZHVjdDo1NTIy',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo3MzAx',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo3Mzc3',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo4NzIx',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo3MzE2',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo3Mzk2',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo4NzA0',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo5MTAy',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo1MjQx',
      },
    },
    {
      node: {
        id: 'UHJvZHVjdDo4OTIw',
      },
    },
  ],
};

export const mockElasticSearchResponse = [
  {
    shr_b2c_product_id: { raw: 'UHJvZHVjdDo3OTU3' },
    retailer_id: { raw: '30' },
    id: { raw: 'doc-63c54aff9e2b18cbf4832ca6' },
    _meta: {
      id: 'doc-63c54aff9e2b18cbf4832ca6',
      engine: 'b2c-product-track-dev',
      score: 1,
    },
    shr_b2b_product_id: { raw: 'UHJvZHVjdDo3OTQx' },
    os_product_id: { raw: 'test' },
  },
  {
    shr_b2c_product_id: { raw: 'UHJvZHVjdDo2ODMz' },
    retailer_id: { raw: '30' },
    id: { raw: 'doc-63c54ae79e2b1823b7832ca2' },
    _meta: {
      id: 'doc-63c54ae79e2b1823b7832ca2',
      engine: 'b2c-product-track-dev',
      score: 1,
    },
    shr_b2b_product_id: { raw: 'UHJvZHVjdDo2ODIz' },
    os_product_id: { raw: 'test' },
  },
];

export const productIntegrationMocks = {
  productsGet: {
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'WyIwMDEiXQ==',
      startCursor: 'WyIwMDEiXQ==',
    },
    totalCount: 10072,
    edges: [
      {
        node: {
          id: 'UHJvZHVjdDoxMjUxNQ==',
          description:
            '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
          name: '001',
          slug: '001',
          defaultVariant: {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
            pricing: {
              price: {
                gross: { currency: 'USD', amount: 4 },
                net: { currency: 'USD', amount: 4 },
              },
            },
          },
          variants: [
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'ONE SIZE' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '3.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '5.6' }],
                },
              ],
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'WHITE' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'ONE SIZE' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '3.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '5.6' }],
                },
              ],
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'PINK' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'ONE SIZE' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '3.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '5.6' }],
                },
              ],
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'GREY' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'ONE SIZE' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '3.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '5.6' }],
                },
              ],
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLUE' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'ONE SIZE' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '3.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '5.6' }],
                },
              ],
            },
          ],
          thumbnail: {
            url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
          },
        },
      },
    ],
  },
  expectedProducts: {
    totalCount: 10072,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'WyIwMDEiXQ==',
      startCursor: 'WyIwMDEiXQ==',
    },
    data: [
      {
        id: 'UHJvZHVjdDoxMjUxNQ==',
        description:
          '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
        name: '001',
        slug: '001',
        variants: [
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'BLACK' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'WHITE' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'PINK' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'GREY' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'BLUE' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
        ],
        thumbnail: {
          url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
        },
        defaultVariant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
          pricing: {
            price: {
              gross: { currency: 'USD', amount: 4 },
              net: { currency: 'USD', amount: 4 },
            },
          },
        },
      },
    ],
  },
  shopProducts: {
    totalCount: 106,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
      startCursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
    },
    edges: [
      {
        cursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
        node: {
          productId: 'UHJvZHVjdDoxMTkwNDA=',
        },
      },
    ],
  },
  shopProductsExpectedResponse: {
    status: 200,
    data: {
      marketplace: {
        totalCount: 106,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
          startCursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
        },
        edges: [
          {
            cursor: 'WyJVSEp2WkhWamREb3hNVGt3TkRBPSJd',
            node: { productId: 'UHJvZHVjdDoxMTkwNDA=' },
          },
        ],
      },
      saleor: {
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: 'WyIwMDEiXQ==',
          startCursor: 'WyIwMDEiXQ==',
        },
        totalCount: 10072,
        edges: [
          {
            node: {
              id: 'UHJvZHVjdDoxMjUxNQ==',
              description:
                '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
              name: '001',
              slug: '001',
              defaultVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
                pricing: {
                  price: {
                    gross: { currency: 'USD', amount: 4 },
                    net: { currency: 'USD', amount: 4 },
                  },
                },
              },
              variants: [
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'WHITE' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'PINK' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'GREY' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLUE' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
              ],
              thumbnail: {
                url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
              },
            },
          },
        ],
      },
    },
  },
  mockElasticSearchMappingData: [
    {
      shr_b2b_product_id: { raw: 'UHJvZHVjdDoxMjUxNQ==' },
      shr_b2c_product_id: { raw: 'testB2cId' },
    },
  ],
  productsWithMappings: {
    totalCount: 10072,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'WyIwMDEiXQ==',
      startCursor: 'WyIwMDEiXQ==',
    },
    data: [
      {
        id: 'UHJvZHVjdDoxMjUxNQ==',
        description:
          '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
        name: '001',
        slug: '001',
        b2cProductId: 'testB2cId',
        variants: [
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'BLACK' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'WHITE' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'PINK' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'GREY' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
          {
            id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
            attributes: [
              {
                attribute: { name: 'Color' },
                values: [{ name: 'BLUE' }],
              },
              {
                attribute: { name: 'Commission' },
                values: [{ name: '10' }],
              },
              {
                attribute: { name: 'Size' },
                values: [{ name: 'ONE SIZE' }],
              },
              {
                attribute: { name: 'Cost Price' },
                values: [{ name: '3.5' }],
              },
              { attribute: { name: 'sku' }, values: [] },
              {
                attribute: { name: 'Resale Price' },
                values: [{ name: '5.6' }],
              },
            ],
          },
        ],
        thumbnail: {
          url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
        },
        defaultVariant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
          pricing: {
            price: {
              gross: { currency: 'USD', amount: 4 },
              net: { currency: 'USD', amount: 4 },
            },
          },
        },
      },
    ],
  },
};
