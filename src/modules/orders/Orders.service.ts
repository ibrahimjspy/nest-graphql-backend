import { Injectable, Logger, Inject } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
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
  getPendingOrders,
  getTotalFromBundles,
} from './Orders.utils';
import { FulfillmentStatusEnum } from 'src/graphql/enums/orders';
import { GQL_EDGES } from 'src/constants';
import { ShopOrdersFulfillmentsDto, ShopOrdersListDto } from './dto';
import { mockOrderReporting } from 'src/graphql/mocks/orderSummary.mock';
import { OrderSummaryResponseDto } from './dto/order.summary.dto';
import { dailySalesHandler } from 'src/graphql/handlers/orders.reporting';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class OrdersService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly logger = new Logger(OrdersService.name);
  private readonly authorizationToken = this.request.headers.authorization;

  public async getDashboardDataById(id): Promise<object> {
    try {
      const response = await dashboardByIdHandler(id, this.authorizationToken);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getAllShopOrdersData(): Promise<object> {
    try {
      const response = await allShopOrdersHandler(this.authorizationToken);
      const shops = (response[GQL_EDGES] || []).map((shop) => shop['node']);
      const shopOrders: ShopOrdersListDto = { orders: [] };

      await Promise.all(
        (shops || []).map(async (shop) => {
          const orders = shop['orders'];

          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await orderDetailsHandler(
                order['orderId'],
                this.authorizationToken,
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

  public async getShopOrdersDataById(id): Promise<object> {
    try {
      const response = await shopOrdersByIdHandler(id, this.authorizationToken);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrderFulfillmentsDataById(id): Promise<object> {
    const orderFulfillments = await shopOrderFulfillmentsByIdHandler(
      id,
      this.authorizationToken,
    );

    const fulfillmentDetails = await shopOrderFulfillmentsDetailsHandler(
      orderFulfillments['orderId'],
      this.authorizationToken,
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
  public async getOrderActivity(): Promise<object> {
    try {
      const response = await orderActivityHandler(this.authorizationToken);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getOrderDetailsById(id: string): Promise<object> {
    try {
      const response = await orderDetailsHandler(id, this.authorizationToken);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersListByShopId(id: string): Promise<object> {
    try {
      const shopDetails = await shopOrdersByIdHandler(
        id,
        this.authorizationToken,
      );
      const orderIds = shopDetails['orders'];
      const ordersList = await ordersListByIdsHandler(
        orderIds,
        this.authorizationToken,
      );
      const response = { ...shopDetails, ...ordersList };

      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
  public async getAllPendingOrders(): Promise<object> {
    try {
      const allOrders = await this.getAllShopOrdersData();
      const pendingOrders = getPendingOrders(allOrders['data'].orders);

      return prepareSuccessResponse(pendingOrders, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersSummary(reportingPeriod): Promise<object> {
    try {
      const dailySales = await dailySalesHandler(
        reportingPeriod,
        this.authorizationToken,
      );
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
}
