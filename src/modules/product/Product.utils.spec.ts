import {
  mockElasticSearchResponse,
  mockProductData,
} from '../../../test/mock/product';
import {
  getBundleIds,
  getProductIds,
  getShopProductIds,
  mergeB2cMappingsWithProductData,
  storeB2bMapping,
  storeB2cMapping,
} from './Product.utils';

describe('Product utility tests', () => {
  it('bundle ids are correctly getting parsed', () => {
    const response = getBundleIds([{ bundleId: '123' }]);
    expect(response).toBeDefined();
    expect(response).toStrictEqual(['123']);
    expect(response).toBeTruthy();
  });

  it('product data is parsing and product ids are returning', () => {
    const response = getProductIds(mockProductData);
    const productId = 'UHJvZHVjdDo4NzA0';

    expect(response).toBeDefined();
    expect(response).toContain(productId);
    expect(response).toBeTruthy();
  });

  it('b2c mapping object is parsed and is stored in ids hashmap', () => {
    const response = storeB2cMapping(mockElasticSearchResponse);
    const b2bId = 'UHJvZHVjdDo3OTQx';
    const b2cId = 'UHJvZHVjdDo3OTU3';

    expect(response).toBeDefined();
    expect(response.get(b2bId)).toContain(b2cId);
    expect(response).toBeTruthy();
  });

  it('shop product ids are correctly getting parsed from shop products list', () => {
    const shopProducts = getShopProductIds({
      totalCount: 20,
      edges: [{ node: { productId: '123' } }],
    });
    expect(shopProducts).toBeDefined();
    expect(shopProducts).toBeTruthy();
    expect(shopProducts).toStrictEqual(['123']);
  });

  it('should parse elastic search response and store b2b and b2c IDs in a hash map', () => {
    const elasticSearchData = [
      {
        shr_b2b_product_id: { raw: 'b2b-id-1' },
        shr_b2c_product_id: { raw: 'b2c-id-1' },
      },
      {
        shr_b2b_product_id: { raw: 'b2b-id-2' },
        shr_b2c_product_id: { raw: 'b2c-id-2' },
      },
    ];

    const expectedMapping = new Map<string, string>([
      ['b2c-id-1', 'b2b-id-1'],
      ['b2c-id-2', 'b2b-id-2'],
    ]);

    const idsMapping = storeB2bMapping(elasticSearchData);

    expect(idsMapping).toStrictEqual(expectedMapping);
  });

  it('should add b2c product ID to products data using the provided IDs mapping (B2B origin)', () => {
    const idsMapping = new Map<string, string>([
      ['b2c-id-1', 'b2b-id-1'],
      ['b2c-id-2', 'b2b-id-2'],
    ]);

    const productsData = {
      edges: [
        {
          node: {
            id: 'b2b-id-1',
          },
        },
        {
          node: {
            id: 'b2b-id-2',
          },
        },
      ],
    };

    const expectedProductsData = {
      edges: [
        {
          node: {
            id: 'b2b-id-1',
            b2cProductId: 'b2c-id-1',
          },
        },
        {
          node: {
            id: 'b2b-id-2',
            b2cProductId: 'b2c-id-2',
          },
        },
      ],
    };

    const mergedProductsData = mergeB2cMappingsWithProductData(
      idsMapping,
      productsData,
      'B2B' as any,
    );

    expect(mergedProductsData).toStrictEqual(expectedProductsData);
  });

  it('should add b2c product ID to products data using the provided IDs mapping (B2C origin)', () => {
    const idsMapping = new Map<string, string>([
      ['b2c-id-1', 'b2b-id-1'],
      ['b2c-id-2', 'b2b-id-2'],
    ]);

    const productsData = {
      edges: [
        {
          node: {
            id: 'b2c-id-1',
          },
        },
        {
          node: {
            id: 'b2c-id-2',
          },
        },
      ],
    };

    const expectedProductsData = {
      edges: [
        {
          node: {
            id: 'b2c-id-1',
            b2bProductId: 'b2b-id-1',
          },
        },
        {
          node: {
            id: 'b2c-id-2',
            b2bProductId: 'b2b-id-2',
          },
        },
      ],
    };

    const mergedProductsData = mergeB2cMappingsWithProductData(
      idsMapping,
      productsData,
      'B2C' as any,
    );

    expect(mergedProductsData).toStrictEqual(expectedProductsData);
  });

  it('should return the original products data if no IDs mapping is provided', () => {
    const idsMapping = new Map<string, string>();

    const productsData = {
      edges: [
        {
          node: {
            id: 'b2b-id-1',
          },
        },
        {
          node: {
            id: 'b2b-id-2',
          },
        },
      ],
    };

    const expectedProductsData = {
      edges: [
        {
          node: {
            id: 'b2b-id-1',
          },
        },
        {
          node: {
            id: 'b2b-id-2',
          },
        },
      ],
    };

    const mergedProductsData = mergeB2cMappingsWithProductData(
      idsMapping,
      productsData,
      'B2B' as any,
    );

    expect(mergedProductsData).toStrictEqual(expectedProductsData);
  });

  it('should return the original products data if products data is not provided', () => {
    const idsMapping = new Map<string, string>();

    const productsData = undefined;

    const expectedProductsData = undefined;

    const mergedProductsData = mergeB2cMappingsWithProductData(
      idsMapping,
      productsData,
      'B2B' as any,
    );

    expect(mergedProductsData).toStrictEqual(expectedProductsData);
  });
});
