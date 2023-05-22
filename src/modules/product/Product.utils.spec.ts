import {
  mockElasticSearchResponse,
  mockProductData,
} from '../../../test/mock/product';
import {
  getBundleIds,
  getProductIds,
  getShopProductIds,
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
});
