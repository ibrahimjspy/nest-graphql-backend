import {
  allShopOrdersQuery,
  dashboardQuery,
  orderActivityQuery,
  orderDetailsQuery,
  orderReturnDetailQuery,
  orderReturnFulfillmentQuery,
  orderReturnsQuery,
  shopOrderFulfillmentDetailsQuery,
  shopOrderFulfillmentsQuery,
  shopOrdersQuery,
} from 'src/graphql/queries/orders';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { ordersListQuery } from '../queries/orders/list';
import { DEFAULT_PAGE_SIZE, GQL_EDGES } from 'src/constants';
import {
  filterReturnOrder,
  filterReturnedOrderIds,
  hasNextPage,
  orderBundlesTransformer,
  orderLinesFulfillTransformer,
  orderLinesTransformer,
} from '../utils/orders';
import { addOrderToShopMutation } from '../mutations/order/addOrderToShop';
import { OrdersListFiltersDTO } from 'src/modules/orders/dto/list';
import {
  OrderReturnDTO,
  OrderReturnFilterDTO,
  ReturnOrderListDto,
} from 'src/modules/orders/dto/order-returns.dto';
import { getOrderStatus } from '../queries/orders/getOrderStatuses';
import { orderFulfillMutation } from '../mutations/order/fulfillOrder';
import {
  FulfillmentUpdateTrackingDto,
  orderLineDTO,
} from 'src/modules/orders/dto/fulfill';
import {
  OrderAmountRefundDto,
  OrderFulfillmentRefundDto,
} from 'src/modules/orders/dto/refund';
import { orderFulfillmentsRefundMutation } from '../mutations/order/refundOrderFulfillments';
import { orderCancelMutation } from '../mutations/order/cancelOrder';
import { orderFulfillmentCancelMutation } from '../mutations/order/cancelOrderFulfillment';
import { updateOrderMetadataMutation } from '../mutations/order/orderMetadata';
import { getReturnsListQuery } from '../queries/orders/returnsList';
import { OrderMetadataDto } from 'src/modules/orders/dto/metadata';
import { orderAmountRefundMutation } from '../mutations/order/refundOrderAmount';
import { getOrderEventsQuery } from '../queries/orders/orderEvents';
import { PaginationDto } from '../dto/pagination.dto';
import { orderFulfillmentTrackingMutation } from '../mutations/order/orderFulfillmentTracking';

export const dashboardByIdHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(dashboardQuery(id), token, true),
  );
  return response;
};

export const allShopOrdersHandler = async (token: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(allShopOrdersQuery(), token),
  );
  if (!response['marketplaceShops']) {
    throw new RecordNotFound('Marketplace shops');
  }
  return response['marketplaceShops'];
};

export const orderDetailsHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderDetailsQuery(id), token),
  );
  if (!response['order']) {
    throw new RecordNotFound('Order details');
  }
  return response['order'];
};

export const shopOrdersByIdHandler = async (
  id: string,
  token: string,
  isB2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrdersQuery(id), token, isB2c),
  );
  if (!response['marketplaceShop']) {
    throw new RecordNotFound('Shop details');
  }
  return response['marketplaceShop'];
};

export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentsQuery(id), token),
  );
  if (!response['marketplaceOrders']?.length) {
    throw new RecordNotFound('Shop order');
  }
  return response['marketplaceOrders'][0];
};

export const shopOrderFulfillmentsDetailsHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentDetailsQuery(id), token),
  );
  if (!response['order']) {
    throw new RecordNotFound('Shop order fulfillment details');
  }
  return response['order'];
};
export const orderActivityHandler = async (token: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderActivityQuery(), token),
  );

  if (!response['homepageEvents']?.[GQL_EDGES]?.length) {
    throw new RecordNotFound('Order activity');
  }
  return response['homepageEvents'][GQL_EDGES];
};

export const ordersListHandler = async (
  filter: OrdersListFiltersDTO,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ordersListQuery(filter), token),
  );
  if (!response['orders']) {
    throw new RecordNotFound('order details');
  }
  return response['orders'];
};

export const addOrderToShopHandler = async (
  order,
  userEmail: string,
  token: string,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      addOrderToShopMutation(
        userEmail,
        order, //uses default bundle information for shop and shipping details
        orderBundlesTransformer(order), //transforms bundles array to graphql string
      ),
      token,
      isB2c,
    ),
  );
  return response['addOrderToShop'];
};

/**
 * It takes a filter, a token, and an orderReturnsList, and returns an orderReturnsList
 * @param {OrderReturnFilterDTO} filters - OrderReturnFilterDTO
 * @param {string} token - The token that you get from the login mutation.
 * @param {any} orderReturnsList - This is the list of order returns that we will be returning.
 * @warn performance implication || this api parses all of the order which is not idea
 * @returns An array of order returns.
 */
export const orderReturnListHandler = async (
  filters: OrderReturnFilterDTO,
  token: string,
  orderReturnsList: Array<any>,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderReturnsQuery(filters), token),
  );
  const filtered_data = filterReturnOrder(response);
  orderReturnsList = orderReturnsList.concat(filtered_data);

  let pageInfo = {};
  const paginationCount = filters.first || filters.last || DEFAULT_PAGE_SIZE;
  const afterOrBefore = filters.first ? 'after' : 'before';
  const selectedCursor =
    afterOrBefore == 'after'
      ? response?.orders?.pageInfo?.endCursor
      : response?.orders?.pageInfo?.startCursor;
  const nextOrReverse =
    afterOrBefore == 'after'
      ? response?.orders.pageInfo?.hasNextPage
      : response?.orders.pageInfo?.hasPreviousPage;
  pageInfo = response?.orders.pageInfo;

  if (
    orderReturnsList.length < paginationCount &&
    nextOrReverse &&
    selectedCursor != ''
  ) {
    const updated_value = {};
    updated_value[afterOrBefore] = JSON.stringify(selectedCursor);

    const resp = await orderReturnListHandler(
      { ...filters, ...updated_value },
      token,
      orderReturnsList,
    );
    pageInfo = resp.orders?.pageInfo;
    orderReturnsList = orderReturnsList.concat(filterReturnOrder(resp));
  }

  const return_resp = {
    orders: {
      pageInfo: pageInfo,
      edges:
        orderReturnsList.length < (paginationCount as number)
          ? orderReturnsList
          : orderReturnsList.slice(0, paginationCount as number),
    },
  };
  return return_resp;
};
/**
 * I have created my own pagination function because.
 * I want to fetch 100 records and filter user specified number from it.
 * So this feature is not being developed in existing utils.
 */
export const getReturnPaginationFilters = (filters: OrderReturnFilterDTO) => {
  if (filters.first) {
    return {
      countKey: 'first',
      cursorKey: 'after',
      first: filters?.first > 100 ? filters?.first : 100,
      after: filters?.after || JSON.stringify(''),
    };
  } else if (filters.last) {
    return {
      countKey: 'last',
      cursorKey: 'before',
      last: filters?.last > 100 ? filters?.last : 100,
      before: filters?.before || JSON.stringify(''),
    };
  } else {
    // If no filter is passed return first by default.
    return {
      countKey: 'first',
      cursorKey: 'after',
      first: 100,
      after: JSON.stringify(''),
    };
  }
};

/**
 * It takes an order_id and a token, and returns an object
 * @param {string} order_id - The order ID of the order you want to return.
 * @param {string} token - The token that you get from the login mutation.
 * @returns The order return detail
 */
export const orderReturnDetailHandler = async (
  order_id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderReturnDetailQuery(order_id), token),
  );
  return response;
};

/**
 * returns order ids of all the orders that have status of RETURNED
 * @warn performance implication || this api parses all of the order ids which is not ideal
 * @returns list of orderIds || string[]
 */
export const getReturnOrderIdsHandler = async ({
  token,
  after = '',
  storeOrderIds = [],
  isb2c = false,
  returnStatus = null,
}): Promise<string[]> => {
  let returnedOrderIds = [];
  const orderStatuses = await graphqlResultErrorHandler(
    await graphqlCall(
      getOrderStatus(after, storeOrderIds, isb2c),
      token,
      isb2c,
    ),
  );
  const orderIds = filterReturnedOrderIds(
    orderStatuses['orders'].edges,
    returnStatus,
  );
  returnedOrderIds = returnedOrderIds.concat(orderIds);
  // check if next page exists add its ids as well
  const nextPage = hasNextPage(orderStatuses['orders'].pageInfo);
  if (nextPage) {
    const nextPageOrderIds = await getReturnOrderIdsHandler({
      token,
      after: nextPage,
      storeOrderIds,
      isb2c,
      returnStatus,
    });
    returnedOrderIds = returnedOrderIds.concat(nextPageOrderIds);
  }
  return returnedOrderIds;
};

/**
 * It takes in a payload and a token, and returns a response
 * @param {OrderReturnDTO} payload - OrderReturnDTO
 * @param {string} token - The token of the user who is making the request.
 * @returns The response from the graphqlCall function.
 */
export const createReturnFulfillmentHandler = async (
  payload: OrderReturnDTO,
  token: string,
  isB2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderReturnFulfillmentQuery(payload), token, isB2c),
  );
  return response;
};

export const orderFulfillHandler = async (
  orderId: string,
  orderLines: orderLineDTO[],
  token,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderFulfillMutation(orderId, orderLinesFulfillTransformer(orderLines)),
      token,
    ),
  );
  return response['orderFulfill'];
};

export const orderFulfillmentRefundHandler = async (
  refundObject: OrderFulfillmentRefundDto,
  token,
  isB2c = false,
): Promise<object> => {
  orderLinesTransformer;
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderFulfillmentsRefundMutation(
        refundObject.order,
        refundObject.input,
        isB2c,
      ),
      token,
    ),
  );
  return response['orderFulfillmentRefundProducts'];
};

export const orderAmountRefundHandler = async (
  refundObject: OrderAmountRefundDto,
  token,
  isB2c = false,
): Promise<object> => {
  orderLinesTransformer;
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderAmountRefundMutation(
        refundObject.orderId,
        refundObject.amount,
        isB2c,
      ),
      token,
    ),
  );
  return response['orderRefund'];
};

export const orderCancelHandler = async (
  orderId: string,
  token,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderCancelMutation(orderId), token),
  );
  return response['orderCancel'];
};

export const orderFulfillmentCancelHandler = async (
  fulfillmentId: string,
  warehouseId: string,
  token,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderFulfillmentCancelMutation(fulfillmentId, warehouseId),
      token,
    ),
  );
  return response['orderFulfillmentCancel'];
};

export const updateOrderMetadataHandler = async (
  orderId: string,
  input: OrderMetadataDto[],
  token: string,
  isB2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateOrderMetadataMutation(orderId, input, isB2c),
      token,
      isB2c,
    ),
  );
  return response['updateMetadata'];
};

export const returnedOrdersListHandler = async (
  filter: ReturnOrderListDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getReturnsListQuery(filter), token),
  );
  return response['orders'];
};

export const orderEventsHandler = async (
  filter: PaginationDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getOrderEventsQuery(filter), token),
  );
  return response['homepageEvents'];
};

export const orderFulfillmentUpdateTrackingHandler = async (
  fulfillmentUpdateTrackingInput: FulfillmentUpdateTrackingDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderFulfillmentTrackingMutation(fulfillmentUpdateTrackingInput),
      token,
    ),
  );
  return response['orderFulfillmentUpdateTracking'];
};
