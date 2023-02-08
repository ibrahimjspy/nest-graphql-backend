import {
  mockElasticSearchResponse,
  mockProductData,
} from '../../../test/mock/product';
import { getProductIds, storeB2cMappingInHashMap } from './Product.utils';

describe('Product utility tests', () => {
  it('product data is parsing and product ids are returning', () => {
    const response = getProductIds(mockProductData);
    const productId = 'UHJvZHVjdDo4NzA0';

    expect(response).toBeDefined();
    expect(response).toContain(productId);
    expect(response).toBeTruthy();
  });

  it('b2c mapping object is parsed and is stored in ids hashmap', () => {
    const response = storeB2cMappingInHashMap(mockElasticSearchResponse);
    const b2bId = 'UHJvZHVjdDo3OTQx';
    const b2cId = 'UHJvZHVjdDo3OTU3';

    expect(response).toBeDefined();
    expect(response.get(b2bId)).toContain(b2cId);
    expect(response).toBeTruthy();
  });
});
