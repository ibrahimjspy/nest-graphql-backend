import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  addOrderToShopHandler,
  allShopOrdersHandler,
  createReturnFulfillmentHandler,
  dashboardByIdHandler,
  getReturnOrderIdsHandler,
  orderActivityHandler,
  orderAmountRefundHandler,
  orderCancelHandler,
  orderDetailsHandler,
  orderEventsHandler,
  orderFulfillHandler,
  orderFulfillmentCancelHandler,
  orderFulfillmentRefundHandler,
  orderReturnDetailHandler,
  orderReturnListHandler,
  ordersListHandler,
  returnOrderDetailsHandler,
  returnedOrdersListHandler,
  shopOrderFulfillmentsByIdHandler,
  shopOrderFulfillmentsDetailsHandler,
  shopOrdersByIdHandler,
  shopOrdersListHandler,
  updateOrderMetadataHandler,
} from 'src/graphql/handlers/orders';
import {
  addStatusAndTotalToBundles,
  getCurrency,
  getFulFillmentsWithStatusAndBundlesTotal,
  getFulfillmentTotal,
  getOrderIdsFromShopData,
  getOrderIdsFromShopOrders,
  getPendingOrders,
  getTotalFromBundles,
} from './Orders.utils';
import { FulfillmentStatusEnum } from 'src/graphql/enums/orders';
import { B2B_DEVELOPMENT_TOKEN, GQL_EDGES } from 'src/constants';
import { ShopOrdersFulfillmentsDto, ShopOrdersListDto } from './dto';
import { mockOrderReporting } from 'src/graphql/mocks/orderSummary.mock';
import {
  OrderSummaryResponseDto,
  ShopOrderReportResponseDto,
} from './dto/order-summary.dto';
import { OrdersListDTO, ShopOrdersListDTO } from './dto/list';
import {
  OrderReturnDTO,
  OrderReturnFilterDTO,
  ReturnOrderListDto,
  ReturnsStaffDto,
} from './dto/order-returns.dto';
import {
  getCancelledOrdersCountHandler,
  getFulfilledOrdersCountHandler,
  getOrdersCountHandler,
  getProcessingOrdersCountHandler,
  getReadyToFulfillOrdersCountHandler,
  getTotalEarningsHandler,
} from 'src/graphql/handlers/orders.reporting';
import { orderLineDTO } from './dto/fulfill';
import { OrderAmountRefundDto, OrderFulfillmentRefundDto } from './dto/refund';
import { AddOrderToShopDto } from './dto/addOrderToShop';
import { StoreOrderAssigneeDto } from './dto/storeOrderAssignee';
import { OrderMetadataDto } from './dto/metadata';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
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
      return prepareSuccessResponse(response, '', 200);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getReturnOrdersDetails(
    id: string,
    token: string,
    isB2c = false,
  ): Promise<object> {
    try {
      const response = await returnOrderDetailsHandler(id, token, isB2c);
      return prepareSuccessResponse(response, '', 200);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersListByShopId(
    shopId: string,
    filter: ShopOrdersListDTO,
    token: string,
  ): Promise<object> {
    try {
      const shopOrders = await shopOrdersListHandler(
        shopId,
        filter,
        token,
        filter.isB2c,
      );
      const orderFilter: ShopOrdersListDTO = filter;
      orderFilter.orderIds = getOrderIdsFromShopOrders(shopOrders);
      if (orderFilter.orderIds.length) {
        const ordersList = await ordersListHandler(orderFilter, token);
        const response = {
          ...shopOrders,
          edges: ordersList?.edges || []
        }
        return prepareSuccessResponse(response);
      }
      return prepareSuccessResponse(shopOrders, 'No order exists against shop');
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
          getReturnOrderIdsHandler({ token }),
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
   * @description -- this method takes marketplace orders in an array and adds that order against shop
   * <> -  maps over orders list
   * <> -  add that order to marketplace shop
   * @params orders => list of marketplace orders with AddOrderToShopDto
   * @links getOrdersByShopId -> this method is used in b2c case where we need to transform checkout bundles and saleor order
   * @returns list of orders against shops which you have added orders against
   */
  public async addOrderToShop(
    orders: AddOrderToShopDto,
    token: string,
    isB2c = false,
  ) {
    try {
      const response = [];
      await Promise.all(
        orders?.marketplaceOrders.map(async (shopOrder) => {
          response.push(
            await addOrderToShopHandler(
              shopOrder,
              orders.userEmail,
              token,
              isB2c,
            ),
          );
        }),
      );
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error);
    }
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
    filter: ReturnsStaffDto,
    token: string,
  ): Promise<object> {
    try {
      const b2cEnabled = filter.isB2c || false;
      const isStaffReturn = filter.staff || false;
      const metadata = [{ key: 'isStaffReturn', value: `${isStaffReturn}` }];
      const response = await createReturnFulfillmentHandler(
        payload,
        token,
        b2cEnabled,
      );
      await updateOrderMetadataHandler(payload.id, metadata, token, b2cEnabled);
      return prepareSuccessResponse(response, '', 200);
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
    trackingNumber: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderFulfillHandler(orderId, orderLineIds, token);
      const metadata: OrderMetadataDto[] = [
        {
          key: 'trackingNumber',
          value: trackingNumber,
        },
      ];
      await updateOrderMetadataHandler(orderId, metadata, token);
      return prepareSuccessResponse(response, 'order fulfilled', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async orderFulfillmentRefund(
    refundObject: OrderFulfillmentRefundDto,
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

  public async orderAmountRefund(
    refundObject: OrderAmountRefundDto,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderAmountRefundHandler(refundObject, token);
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

  public async getShopOrderReport(
    shopId: string,
    token: string,
  ): Promise<object> {
    try {
      const shopDetails = await shopOrdersByIdHandler(shopId, token, true);
      const orderIds: string[] = getOrderIdsFromShopData(shopDetails);
      const [processing, shipped, cancelled, returned, totalEarnings] =
        await Promise.all([
          getProcessingOrdersCountHandler(token, orderIds, true),
          getFulfilledOrdersCountHandler(token, orderIds, true),
          getCancelledOrdersCountHandler(token, orderIds, true),
          getReturnOrderIdsHandler({
            token,
            after: '',
            storeOrderIds: orderIds,
            isb2c: true,
          }),
          // TODO replace development token with AUTHO token
          getTotalEarningsHandler(shopId, token, true),
        ]);
      const response: ShopOrderReportResponseDto = {
        ordersProcessing: processing,
        ordersShipped: shipped,
        ordersCancelled: cancelled,
        ordersReturnsRequested: returned.length,
        totalEarnings: Number(totalEarnings['price']),
      };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getReturnsListByFilters(
    filter: ReturnOrderListDto,
    token: string,
  ): Promise<object> {
    try {
      const returnedOrderIds = await getReturnOrderIdsHandler({
        token,
        returnStatus: filter.returnStatus,
      });
      filter.orderIds = returnedOrderIds;
      const response = await returnedOrdersListHandler(filter, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async addOrderAssignee(
    orderData: StoreOrderAssigneeDto,
    token: string,
    isB2c = false,
  ): Promise<object> {
    try {
      const orderId: string = orderData.orderId;
      const metadata: OrderMetadataDto[] = [
        {
          key: 'staffId',
          value: orderData.staffId,
        },
        {
          key: 'staffName',
          value: orderData.staffName,
        },
        {
          key: 'assignedAt',
          value: new Date().toISOString(),
        },
      ];
      return prepareSuccessResponse(
        await updateOrderMetadataHandler(orderId, metadata, token, isB2c),
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrderEvents(
    filter: PaginationDto,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderEventsHandler(filter, token);
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
