import {
  expectedOrdersByShop,
  mockCheckoutBundles,
  mockOrderData,
} from '../../../test/mock/addOrderToShop';
import { getOrderIdsFromShopData, getOrdersByShopId } from './Orders.utils';

describe('Order utility tests', () => {
  it('product data is parsing and product ids are returning', () => {
    const mockOrdersData = { orders: [{ orderId: 'test1' }] };
    const response = getOrderIdsFromShopData(mockOrdersData);

    expect(response).toBeDefined();
    expect(response).toStrictEqual(['test1']);
    expect(response).toBeTruthy();
  });

  it('add products to shop transformer is correctly working', () => {
    const allOrdersByShopId = getOrdersByShopId(
      mockCheckoutBundles,
      mockOrderData,
    );
    expect(allOrdersByShopId).toBeDefined();
    expect(allOrdersByShopId).toStrictEqual(expectedOrdersByShop);
  });
});
