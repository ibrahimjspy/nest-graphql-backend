import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  addOrderToShopHandler,
  allShopOrdersHandler,
  dashboardByIdHandler,
  orderActivityHandler,
  orderDetailsHandler,
  ordersListByIdsHandler,
  shopOrderFulfillmentsByIdHandler,
  shopOrderFulfillmentsDetailsHandler,
  shopOrdersByIdHandler,
} from 'src/graphql/handlers/orders';
import {
  addStatusAndTotalToBundles,
  getCurrency,
  getFulFillmentsWithStatusAndBundlesTotal,
  getFulfillmentTotal,
  getOrdersByShopId,
  getPendingOrders,
  getTotalFromBundles,
} from './Orders.utils';
import { FulfillmentStatusEnum } from 'src/graphql/enums/orders';
import { GQL_EDGES } from 'src/constants';
import { ShopOrdersFulfillmentsDto, ShopOrdersListDto } from './dto';
import { mockOrderReporting } from 'src/graphql/mocks/orderSummary.mock';
import { OrderSummaryResponseDto } from './dto/order.summary.dto';
import { dailySalesHandler } from 'src/graphql/handlers/orders.reporting';
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  public async getDashboardDataById(id, headers: string): Promise<object> {
    try {
      const response = await dashboardByIdHandler(id, headers);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getAllShopOrdersData(headers: string): Promise<object> {
    try {
      const response = await allShopOrdersHandler(headers);
      const shops = (response[GQL_EDGES] || []).map((shop) => shop['node']);
      const shopOrders: ShopOrdersListDto = { orders: [] };

      await Promise.all(
        (shops || []).map(async (shop) => {
          const orders = shop['orders'];

          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await orderDetailsHandler(
                order['orderId'],
                headers,
              );
              const orderBundlesTotal = getTotalFromBundles(
                order['orderBundles'],
              );
              const fulfillmentsTotal = getFulfillmentTotal(
                order['fulfillments'],
              );
              const currency = getCurrency(order['orderBundles']);
              const { fulfillments, orderBundles, ...otherOrderAttributes } =
                order;
              shopOrders.orders.push({
                ...otherOrderAttributes,
                ...orderDetails,
                shopName: shop['name'],
                shopId: shop['id'],
                currency: currency,
                totalAmount: orderBundlesTotal + fulfillmentsTotal,
              });
            }),
          );
        }),
      );
      return prepareSuccessResponse(shopOrders, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrdersDataById(id, headers: string): Promise<object> {
    try {
      const response = await shopOrdersByIdHandler(id, headers);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrderFulfillmentsDataById(
    id,
    headers: string,
  ): Promise<object> {
    const orderFulfillments = await shopOrderFulfillmentsByIdHandler(
      id,
      headers,
    );

    const fulfillmentDetails = await shopOrderFulfillmentsDetailsHandler(
      orderFulfillments['orderId'],
      headers,
    );

    const orderFulfillmentBundles = addStatusAndTotalToBundles(
      orderFulfillments['orderBundles'],
      FulfillmentStatusEnum.UNFULFILLED,
    );
    const fulfillments = getFulFillmentsWithStatusAndBundlesTotal(
      orderFulfillments['fulfillments'],
      FulfillmentStatusEnum.FULFILLED,
    );
    const fulfillmentTotalAmount = getTotalFromBundles(
      orderFulfillments['orderBundles'],
    );

    const response: ShopOrdersFulfillmentsDto = {
      ...fulfillmentDetails,
      totalAmount: fulfillmentTotalAmount,
      orderBundles: orderFulfillmentBundles,
      fulfillments,
    };

    return response;
  }
  public async getOrderActivity(headers: string): Promise<object> {
    try {
      const response = await orderActivityHandler(headers);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getOrderDetailsById(
    id: string,
    headers: string,
  ): Promise<object> {
    try {
      const response = await orderDetailsHandler(id, headers);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersListByShopId(
    id: string,
    headers: string,
  ): Promise<object> {
    try {
      const shopDetails = await shopOrdersByIdHandler(id, headers);
      const orderIds = shopDetails['orders'];
      const ordersList = await ordersListByIdsHandler(orderIds, headers);
      const response = { ...shopDetails, ...ordersList };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
  public async getAllPendingOrders(headers: string): Promise<object> {
    try {
      const allOrders = await this.getAllShopOrdersData(headers);
      const pendingOrders = getPendingOrders(allOrders['data'].orders);

      return prepareSuccessResponse(pendingOrders, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersSummary(
    reportingPeriod,
    headers: string,
  ): Promise<object> {
    try {
      const dailySales = await dailySalesHandler(reportingPeriod, headers);
      const mock = mockOrderReporting();
      const response: OrderSummaryResponseDto = {
        dailySales: dailySales['gross'].amount,
        ...mock,
      };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  /**
   * this method takes checkout bundles and Saleor order data;
   * <> -  transforms single order against each shop
   * <> -  add that order information through mutation in shop service
   * @params checkoutData : marketplace checkout data containing bundles and shipping information
   * @params orderInfo : Saleor order information containing line ids of order
   * @returns void || success response;
   */
  public async addOrderToShop(checkoutBundles, orderData) {
    const ordersByShop = getOrdersByShopId(checkoutBundles, orderData);
    return Promise.all(
      Object.values(ordersByShop).map(async (shopOrder) => {
        await addOrderToShopHandler(shopOrder);
      }),
    );
  }
}
