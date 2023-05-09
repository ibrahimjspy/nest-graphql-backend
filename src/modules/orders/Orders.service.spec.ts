import { Test, TestingModule } from '@nestjs/testing';
import * as OrderHandlers from 'src/graphql/handlers/orders';
import * as OrderReporting from 'src/graphql/handlers/orders.reporting';
import { OrdersService } from './Orders.service';

describe('Shop Service Integration test', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();
    module.useLogger(false);

    service = module.get<OrdersService>(OrdersService);
  });

  it('should store assignee data', async () => {
    jest
      .spyOn(OrderHandlers, 'updateOrderMetadataHandler')
      .mockImplementation(async () => {
        return { metadata: 'stored' };
      });

    const storeAssignee = await service.addOrderAssignee(
      { orderId: '123', staffId: '124', staffName: '1234test' },
      '',
    );
    expect(storeAssignee).toEqual({
      status: 200,
      data: { metadata: 'stored' },
    });
    expect(storeAssignee).toBeDefined();
  });

  it('should get order data', async () => {
    jest
      .spyOn(OrderHandlers, 'orderDetailsHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const orderDetails = await service.getOrderDetailsById('123', '');
    expect(orderDetails).toEqual({ status: 200, data: { order: 'test' } });
    expect(orderDetails).toBeDefined();
  });

  it('should get order list data', async () => {
    jest
      .spyOn(OrderHandlers, 'ordersListHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });

    const orderList = await service.getOrdersList({ first: 10 }, '');
    expect(orderList).toEqual({
      status: 200,
      data: { orders: [{ order: '123' }] },
    });
    expect(orderList).toBeDefined();
  });

  it('should get order list data by shop', async () => {
    jest
      .spyOn(OrderHandlers, 'ordersListHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });

    const orderList = await service.getOrdersListByShopId(
      '12',
      { first: 10 },
      '',
    );
    expect(orderList).toEqual({
      status: 200,
      data: { orders: [{ order: '123' }] },
    });
    expect(orderList).toBeDefined();
  });

  it('order summary is correctly getting ', async () => {
    jest
      .spyOn(OrderReporting, 'getOrdersCountHandler')
      .mockImplementation(async () => {
        return 100;
      });
    jest
      .spyOn(OrderReporting, 'getReadyToFulfillOrdersCountHandler')
      .mockImplementation(async () => {
        return 20 as any;
      });
    jest
      .spyOn(OrderHandlers, 'getReturnOrderIdsHandler')
      .mockImplementation(async () => {
        return ['1234'];
      });

    const orderSummary = await service.getOrdersSummary('12');
    expect(orderSummary).toBeDefined();
  });

  it('shop order report is correctly getting made', async () => {
    jest
      .spyOn(OrderHandlers, 'shopOrdersByIdHandler')
      .mockImplementation(async () => {
        return { orders: [{ orderId: '123' }] };
      });
    jest
      .spyOn(OrderReporting, 'getProcessingOrdersCountHandler')
      .mockImplementation(async () => {
        return 2;
      });
    jest
      .spyOn(OrderReporting, 'getFulfilledOrdersCountHandler')
      .mockImplementation(async () => {
        return 20;
      });
    jest
      .spyOn(OrderReporting, 'getCancelledOrdersCountHandler')
      .mockImplementation(async () => {
        return 2001;
      });
    jest
      .spyOn(OrderHandlers, 'getReturnOrderIdsHandler')
      .mockImplementation(async () => {
        return ['12', '12'];
      });
    jest
      .spyOn(OrderReporting, 'getTotalEarningsHandler')
      .mockImplementation(async () => {
        return { price: 12 };
      });
    const shopOrdersReport = await service.getShopOrderReport('12', '');
    expect(shopOrdersReport).toEqual({
      status: 201,
      data: {
        ordersProcessing: 2,
        ordersShipped: 20,
        ordersCancelled: 2001,
        ordersReturnsRequested: 2,
        totalEarnings: 12,
      },
    });
    expect(shopOrdersReport).toBeDefined();
  });

  it('should get return  order list data by shop', async () => {
    jest
      .spyOn(OrderHandlers, 'returnedOrdersListHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });
    jest
      .spyOn(OrderHandlers, 'getReturnOrderIdsHandler')
      .mockImplementation(async () => {
        return ['123'];
      });

    const orderList = await service.getReturnsListByFilters(
      { first: 10, isStaffReturn: 'false' },
      '',
    );
    expect(orderList).toEqual({
      status: 200,
      data: { orders: [{ order: '123' }] },
    });
    expect(orderList).toBeDefined();
  });

  it('should get return  order list data by shop', async () => {
    jest
      .spyOn(OrderHandlers, 'returnedOrdersListHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });
    jest
      .spyOn(OrderHandlers, 'getReturnOrderIdsHandler')
      .mockImplementation(async () => {
        return ['123'];
      });

    const orderList = await service.getReturnsListByFilters(
      { first: 10, isStaffReturn: 'false' },
      '',
    );
    expect(orderList).toEqual({
      status: 200,
      data: { orders: [{ order: '123' }] },
    });
    expect(orderList).toBeDefined();
  });

  it('order return is placed', async () => {
    jest
      .spyOn(OrderHandlers, 'createReturnFulfillmentHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });
    jest
      .spyOn(OrderHandlers, 'updateOrderMetadataHandler')
      .mockImplementation(async () => {
        return [{ metadata: 'done' }];
      });

    const placeOrderReturn = await service.placeOrderReturn(
      {
        id: '123',
        input: {
          orderLines: [{ orderLineId: '12', quantity: 3 }],
          fulfillmentLines: [],
          includeShippingCosts: false,
          refund: false,
        },
      },
      {
        staff: false,
      },
      '',
    );
    expect(placeOrderReturn).toEqual({
      status: 201,
      data: { orders: [{ order: '123' }] },
      message: 'order return placed',
    });
    expect(placeOrderReturn).toBeDefined();
  });

  it('order fulfillment is placed', async () => {
    jest
      .spyOn(OrderHandlers, 'orderFulfillHandler')
      .mockImplementation(async () => {
        return { orders: [{ order: '123' }] };
      });
    jest
      .spyOn(OrderHandlers, 'updateOrderMetadataHandler')
      .mockImplementation(async () => {
        return [{ metadata: 'done' }];
      });

    const orderFulfill = await service.orderFulfill('123', [], '1', '');
    expect(orderFulfill).toEqual({
      status: 201,
      data: { orders: [{ order: '123' }] },
      message: 'order fulfilled',
    });
    expect(orderFulfill).toBeDefined();
  });

  it('should fulfillment cancel is placed ', async () => {
    jest
      .spyOn(OrderHandlers, 'orderFulfillmentRefundHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const fulfillmentRefund = await service.orderFulfillmentRefund(
      {
        order: '',
        input: {
          orderLines: [{ orderLineId: '1', quantity: 3 }],
          fulfillmentLines: [],
          includeShippingCosts: false,
          amountToRefund: true,
        },
      },
      '',
    );
    expect(fulfillmentRefund).toEqual({
      status: 201,
      data: { order: 'test' },
      message: 'order fulfillment is refunded',
    });
    expect(fulfillmentRefund).toBeDefined();
  });

  it('order cancel is placed', async () => {
    jest
      .spyOn(OrderHandlers, 'orderCancelHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const orderDetails = await service.orderCancel('12', '');
    expect(orderDetails).toEqual({
      status: 201,
      data: { order: 'test' },
      message: 'order is cancelled',
    });
    expect(orderDetails).toBeDefined();
  });

  it('order amount refund is placed', async () => {
    jest
      .spyOn(OrderHandlers, 'orderAmountRefundHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const orderDetails = await service.orderAmountRefund(
      {
        orderId: '12',
        amount: 2,
      },
      '',
    );
    expect(orderDetails).toEqual({
      status: 201,
      data: { order: 'test' },
      message: 'order amount is refunded',
    });
    expect(orderDetails).toBeDefined();
  });

  it('order fulfillment tracking is updated', async () => {
    jest
      .spyOn(OrderHandlers, 'orderFulfillmentUpdateTrackingHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const fulfillmentUpdateTracking =
      await service.orderFulfillmentUpdateTracking(
        {
          fulfillmentId: '12',
          trackingNumber: '10',
        },
        '',
      );
    expect(fulfillmentUpdateTracking).toEqual({
      status: 201,
      data: { order: 'test' },
      message: 'fulfillment tracking updated',
    });
    expect(fulfillmentUpdateTracking).toBeDefined();
  });

  it('able to get order events', async () => {
    jest
      .spyOn(OrderHandlers, 'orderEventsHandler')
      .mockImplementation(async () => {
        return { order: 'test' };
      });

    const orderEvents = await service.getOrderEvents(
      {
        first: 20,
      },
      '',
    );
    expect(orderEvents).toEqual({
      status: 200,
      data: { order: 'test' },
    });
    expect(orderEvents).toBeDefined();
  });
});
