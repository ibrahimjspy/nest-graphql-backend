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
