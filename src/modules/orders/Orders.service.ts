import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  addOrderToShopHandler,
  createReturnFulfillmentHandler,
  getReturnOrderIdsHandler,
  orderAmountRefundHandler,
  orderCancelHandler,
  orderDetailsHandler,
  orderEventsHandler,
  orderFulfillHandler,
  orderFulfillmentCancelHandler,
  orderFulfillmentRefundHandler,
  orderFulfillmentUpdateTrackingHandler,
  ordersListHandler,
  returnOrderDetailsHandler,
  returnedOrdersListHandler,
  updateOrderMetadataHandler,
} from 'src/graphql/handlers/orders';

import { mockOrderReporting } from 'src/graphql/mocks/orderSummary.mock';
import {
  OrderSummaryResponseDto,
  ShopOrderReportResponseDto,
} from './dto/order-summary.dto';
import { OrdersListDTO } from './dto/list';
import {
  OrderReturnDTO,
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
import { FulfillmentUpdateTrackingDto, orderLineDTO } from './dto/fulfill';
import { OrderAmountRefundDto, OrderFulfillmentRefundDto } from './dto/refund';
import { AddOrderToShopDto } from './dto/addOrderToShop';
import { StoreOrderAssigneeDto } from './dto/storeOrderAssignee';
import { OrderMetadataDto } from './dto/metadata';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { uploadImagesHandler } from 'src/external/services/uploadImages';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  public async getOrderDetailsById(id: string, token: string): Promise<object> {
    try {
      const response = await orderDetailsHandler(id, token);
      return prepareSuccessResponse(response, '', 200);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getOrdersListByShopId(
    shopId: string,
    filter: OrdersListDTO,
    token: string,
  ): Promise<object> {
    try {
      const ordersList = await ordersListHandler({ shopId, ...filter }, token);
      return prepareSuccessResponse(ordersList);
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
      return prepareSuccessResponse(response);
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

  public async placeOrderReturn(
    payload: OrderReturnDTO,
    filter: ReturnsStaffDto,
    token: string,
  ): Promise<object> {
    try {
      this.logger.log('Placing order return', payload);
      const b2cEnabled = filter.isB2c || false;
      const isStaffReturn = filter.staff || false;
      const metadata = [{ key: 'isStaffReturn', value: `${isStaffReturn}` }];
      const response = await createReturnFulfillmentHandler(
        payload,
        token,
        b2cEnabled,
      );
      await updateOrderMetadataHandler(payload.id, metadata, token, b2cEnabled);
      return prepareSuccessResponse(response, 'order return placed', 201);
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
      this.logger.log(`Fulfilling order ${orderId}`, orderLineIds);

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
      return prepareSuccessResponse(
        response,
        'order fulfillment is refunded',
        201,
      );
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
      return prepareSuccessResponse(response, 'order amount is refunded', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async orderCancel(orderId: string, token: string): Promise<object> {
    try {
      this.logger.log('Cancelling order', orderId);
      const response = await orderCancelHandler(orderId, token);
      return prepareSuccessResponse(response, 'order is cancelled', 201);
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
      this.logger.log('Cancelling order fulfillment', fulfillmentId);
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
      const shopOrderMetadata = [{ key: 'storeId', value: shopId }];
      const [processing, shipped, cancelled, returned, totalEarnings] =
        await Promise.all([
          getProcessingOrdersCountHandler(token, shopOrderMetadata, true),
          getFulfilledOrdersCountHandler(token, shopOrderMetadata, true),
          getCancelledOrdersCountHandler(token, shopOrderMetadata, true),
          getReturnOrderIdsHandler({
            token,
            after: '',
            metadata: shopOrderMetadata,
            isb2c: true,
          }),
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
      return prepareSuccessResponse(response);
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

  public async orderFulfillmentUpdateTracking(
    fulfillmentUpdateTrackingInput: FulfillmentUpdateTrackingDto,
    token: string,
  ): Promise<object> {
    try {
      const response = await orderFulfillmentUpdateTrackingHandler(
        fulfillmentUpdateTrackingInput,
        token,
      );
      return prepareSuccessResponse(
        response,
        'fulfillment tracking updated',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async uploadImages(file: any): Promise<object> {
    try {
      const bucket = process.env.AWS_BUCKET_NAME;
      return prepareSuccessResponse(await uploadImagesHandler(file, bucket));
    } catch (error) {
      return graphqlExceptionHandler(error);
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
}
