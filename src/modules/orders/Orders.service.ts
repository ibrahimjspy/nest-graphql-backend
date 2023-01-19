import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  addOrderToShopHandler,
  allShopOrdersHandler,
  createReturnFulfillmentHandler,
  dashboardByIdHandler,
  getReturnOrderIdsHandler,
  orderActivityHandler,
  orderCancelHandler,
  orderDetailsHandler,
  orderFulfillHandler,
  orderFulfillmentCancelHandler,
  orderFulfillmentRefundHandler,
  orderReturnDetailHandler,
  orderReturnListHandler,
  ordersListHandler,
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
import { OrderSummaryResponseDto } from './dto/order-summary.dto';
import { OrdersListDTO } from './dto/list';
import { OrderReturnDTO, OrderReturnFilterDTO } from './dto/order-returns.dto';
import {
  getOrdersCountHandler,
  getReadyToFulfillOrdersCountHandler,
} from 'src/graphql/handlers/orders.reporting';
import { orderLineDTO } from './dto/fulfill';
import { OrderRefundDTO } from './dto/refund';
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  public async getDashboardDataById(id, token: string): Promise<object> {
    try {
      const response = await dashboardByIdHandler(id, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getAllShopOrdersData(token: string): Promise<object> {
    try {
      const response = await allShopOrdersHandler(token);
      const shops = (response[GQL_EDGES] || []).map((shop) => shop['node']);
      const shopOrders: ShopOrdersListDto = { orders: [] };

      await Promise.all(
        (shops || []).map(async (shop) => {
          const orders = shop['orders'];

          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await orderDetailsHandler(
                order['orderId'],
                token,
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

  public async getShopOrdersDataById(id, token: string): Promise<object> {
    try {
      const response = await shopOrdersByIdHandler(id, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrderFulfillmentsDataById(
    id,
    token: string,
  ): Promise<object> {
    const orderFulfillments = await shopOrderFulfillmentsByIdHandler(id, token);

    const fulfillmentDetails = await shopOrderFulfillmentsDetailsHandler(
      orderFulfillments['orderId'],
      token,
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
  public async getOrderActivity(token: string): Promise<object> {
    try {
      const response = await orderActivityHandler(token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getOrderDetailsById(id: string, token: string): Promise<object> {
    try {
      const response = await orderDetailsHandler(id, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersListByShopId(
    id: string,
    filter: OrdersListDTO,
    token: string,
  ): Promise<object> {
    try {
      const shopDetails = await shopOrdersByIdHandler(id, token);
      const orderFilter: OrdersListDTO = filter;
      orderFilter.orderIds = shopDetails['orders'];
      const ordersList = await ordersListHandler(orderFilter, token);
      const response = { ...shopDetails, ...ordersList };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
  public async getAllPendingOrders(token: string): Promise<object> {
    try {
      const allOrders = await this.getAllShopOrdersData(token);
      const pendingOrders = getPendingOrders(allOrders['data'].orders);

      return prepareSuccessResponse(pendingOrders, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersSummary(token: string): Promise<object> {
    try {
      const [totalOrders, totalReadyToFulfill, ordersReturns] =
        await Promise.all([
          getOrdersCountHandler(token),
          getReadyToFulfillOrdersCountHandler(token),
          getReturnOrderIdsHandler(token),
        ]);
      const response: OrderSummaryResponseDto = {
        dailySales: mockOrderReporting().dailySales,
        totalOrders: totalOrders,
        readyToFulfill: totalReadyToFulfill,
        ordersReturned: ordersReturns.length,
        ordersToPickup: mockOrderReporting().ordersToPickup,
      };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersList(
    filter: OrdersListDTO,
    token: string,
  ): Promise<object> {
    try {
      const response = await ordersListHandler(filter, token);
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

  /**
   * It fetches the order returns list from the database and returns it to the client
   * @param {OrderReturnFilterDTO} filters - OrderReturnFilterDTO,
   * @param {string} token - The token of the user who is making the request.
   * @returns An array of order returns
   */
  public async getOrderReturns(
    filters: OrderReturnFilterDTO,
    token: string,
  ): Promise<object> {
    try {
      // eslint-disable-next-line prefer-const
      let orderReturnsList = [];
      const response = await orderReturnListHandler(
        filters,
        token,
        orderReturnsList,
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  /**
   * It fetches the order return details by order id
   * @param {string} order_id - The order id of the order for which the return is being requested.
   * @param {string} token - The token of the user who is making the request.
   * @returns An object with the response and the status code.
   */
  public async getOrderReturnById(
    order_id: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderReturnDetailHandler(order_id, token);
      return prepareSuccessResponse(response, '', 200);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async placeOrderReturn(
    payload: OrderReturnDTO,
    token: string,
  ): Promise<object> {
    try {
      const response = await createReturnFulfillmentHandler(payload, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  /**
   * this method fulfills a order in Saleor and returns a fulfillment id
   * @warn - currently it requires a separate method to be called to assign fulfillment to marketplace shop
   */
  public async orderFulfill(
    orderId: string,
    orderLineIds: orderLineDTO[],
    token: string,
  ): Promise<object> {
    try {
      const response = await orderFulfillHandler(orderId, orderLineIds, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async orderRefund(
    refundObject: OrderRefundDTO,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderFulfillmentRefundHandler(refundObject, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async orderCancel(orderId: string, token: string): Promise<object> {
    try {
      const response = await orderCancelHandler(orderId, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async orderFulfillmentCancel(
    fulfillmentId: string,
    warehouseId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderFulfillmentCancelHandler(
        fulfillmentId,
        warehouseId,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
