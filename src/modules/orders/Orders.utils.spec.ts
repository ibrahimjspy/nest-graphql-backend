import {
  mockElasticSearchResponse,
  mockProductData,
} from '../../../test/mock/product';
import { getOrderIdsFromShopData } from './Orders.utils';

describe('Order utility tests', () => {
  it('product data is parsing and product ids are returning', () => {
    const mockOrdersData = { orders: [{ orderId: 'test1' }] };
    const response = getOrderIdsFromShopData(mockOrdersData);
    console.log(response);

    expect(response).toBeDefined();
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
});
