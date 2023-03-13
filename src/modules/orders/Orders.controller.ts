import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';
import { makeResponse } from '../../core/utils/response';
import { OrderIdDto, ShopIdDto, UserIdDto } from './dto';
import { OrdersListDTO } from './dto/list';
import {
  OrderReturnDTO,
  OrderReturnFilterDTO,
  ReturnOrderListDto,
  ReturnsStaffDto,
} from './dto/order-returns.dto';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { OrderFulfillDto, orderFulfillmentCancelDTO } from './dto/fulfill';
import { OrderAmountRefundDto, OrderFulfillmentRefundDto } from './dto/refund';
import { b2cDto, shopIdDTO } from '../shop/dto/shop';
import { AddOrderToShopDto } from './dto/addOrderToShop';
import { StoreOrderAssigneeDto } from './dto/storeOrderAssignee';
import UpsService from 'src/external/services/Ups.service';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

@ApiTags('orders')
@Controller('')
export class OrdersController {
  constructor(
    private readonly appService: OrdersService,
    private readonly upsService: UpsService,
  ) {}
  // Returns orders dashboard data for landing page
  @Get('orders/history/:userId')
  async findDashboard(
    @Res() res,
    @Param() userDto: UserIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getDashboardDataById(
        userDto?.userId,
        Authorization,
      ),
    );
  }
  // Returns all shop orders for orders page
  @Get('orders/marketplace/all')
  async findAllShopOrders(@Res() res, @Headers() headers): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getAllShopOrdersData(Authorization),
    );
  }
  // Returns shop orders for orders page
  @Get('orders/marketplace/shop/:shopId')
  async findShopOrders(
    @Res() res,
    @Param() shopDto: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShopOrdersDataById(
        shopDto.shopId,
        Authorization,
      ),
    );
  }
  // Returns shop order fulfillments for order page
  @Get('orders/marketplace/shop/fulfillment/:orderId')
  async findShopOrderFulfillments(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShopOrderFulfillmentsDataById(
        orderDto.orderId,
        Authorization,
      ),
    );
  }
  // Returns shop order activities
  @Get('orders/activity')
  async getOrderActivity(@Res() res, @Headers() headers): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrderActivity(Authorization),
    );
  }

  // Returns shop order details
  @Get('orders/detail/:orderId')
  async getOrderDetails(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrderDetailsById(
        orderDto.orderId,
        Authorization,
      ),
    );
  }

  // Returns shop orders list
  @Get('api/v1/orders/list/shop/:shopId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'returns orders list against given shop id' })
  async getOrdersListByShopId(
    @Res() res,
    @Param() shopDto: ShopIdDto,
    @Query() filter: OrdersListDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrdersListByShopId(
        shopDto.shopId,
        filter,
        Authorization,
      ),
    );
  }

  // Returns all pending shop orders for orders list page
  @Get('orders/marketplace/all/pending')
  async findAllPendingOrders(@Res() res, @Headers() headers): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getAllPendingOrders(Authorization),
    );
  }

  // Returns orders summary
  @Get('api/v1/orders/summary')
  @ApiOperation({ summary: 'returns orders summary of all time' })
  async findOrdersSummary(@Res() res, @Headers() headers): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrdersSummary(Authorization),
    );
  }

  // Returns all orders list
  @Get('api/v1/orders/list')
  async findAllOrders(
    @Res() res,
    @Headers() headers,
    @Query() filter: OrdersListDTO,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrdersList(filter, Authorization),
    );
  }

  // Return all orders(which are return by end customer)
  @Get('api/v1/orders/returns')
  async getOrderReturns(
    @Res() res,
    @IsAuthenticated('authorization') token: string,
    @Query() filters: OrderReturnFilterDTO,
  ) {
    return makeResponse(
      res,
      await this.appService.getOrderReturns(filters, token),
    );
  }

  @Get('api/v1/orders/return/:orderId')
  async getOrderReturnDetails(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.getOrderReturnById(orderDto.orderId, token),
    );
  }

  @Post('api/v1/order/return')
  @ApiBearerAuth('JWT-auth')
  async returnOrder(
    @Res() res,
    @Query() filters: ReturnsStaffDto,
    @Body() orderDTO: OrderReturnDTO,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.placeOrderReturn(orderDTO, filters, token),
    );
  }

  @Post('api/v1/order/fulfill')
  @ApiBearerAuth('JWT-auth')
  async fulfillOrder(
    @Res() res,
    @Body() orderDto: OrderFulfillDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderFulfill(
        orderDto.orderId,
        orderDto.orderLines,
        orderDto.trackingNumber,
        token,
      ),
    );
  }

  @Post('api/v1/order/fulfillment/refund')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'api to refund order lines both fulfilled and unfulfilled',
  })
  async refundOrder(
    @Res() res,
    @Body() orderDto: OrderFulfillmentRefundDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderFulfillmentRefund(orderDto, token),
    );
  }

  @Post('api/v1/order/amount/refund')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'api to refund order with specified order amount',
  })
  async refundOrderAmount(
    @Res() res,
    @Body() orderDto: OrderAmountRefundDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderAmountRefund(orderDto, token),
    );
  }

  @Post('api/v1/order/cancel')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'cancels an order against its id',
  })
  async cancelOrder(
    @Res() res,
    @Body() orderDto: OrderIdDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderCancel(orderDto.orderId, token),
    );
  }

  @Post('api/v1/order/fulfillment/cancel')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'cancels an order fulfillment against its id',
  })
  async cancelOrderFulfillment(
    @Res() res,
    @Body() orderDto: orderFulfillmentCancelDTO,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderFulfillmentCancel(
        orderDto.fulfillmentId,
        orderDto.warehouseId,
        token,
      ),
    );
  }

  @Get('api/v1/orders/report/:shopId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'returns order report against a particular shop',
  })
  async getRetailerOrderReport(
    @Res() res,
    @Param() orderDto: shopIdDTO,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.getShopOrderReport(orderDto.shopId, token),
    );
  }

  @Get('api/v1/orders/return')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Return all orders which are return by end customer extending list api filters',
  })
  async getOrderReturnsByFilters(
    @Res() res,
    @IsAuthenticated('authorization') token: string,
    @Query() filters: ReturnOrderListDto,
  ) {
    return makeResponse(
      res,
      await this.appService.getReturnsListByFilters(filters, token),
    );
  }

  // Returns shop order details
  @Get('api/v1/order/return/:orderId')
  @ApiBearerAuth('JWT-auth')
  async getReturnedOrderDetails(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @Query() filter: b2cDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getReturnOrdersDetails(
        orderDto.orderId,
        Authorization,
        filter.isB2c,
      ),
    );
  }

  @Post('api/v1/marketplace/order')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'this api adds orders against marketplace shops',
  })
  async addOrdersToMarketplace(
    @Res() res,
    @Body() body: AddOrderToShopDto,
    @Query() filter: b2cDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.addOrderToShop(body, token, filter.isB2c),
    );
  }

  @Post('api/v1/order/assign')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'this api store assignee information in order metadata',
  })
  async assignStaffToOrder(
    @Res() res,
    @Body() body: StoreOrderAssigneeDto,
    @Query() filter: b2cDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.addOrderAssignee(body, token, filter.isB2c),
    );
  }

  @Post('api/v1/order/shipping/label')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'this api generates a shipping label based on Shipping information such as address, charges and services',
  })
  async generateShippingLabel(@Res() res, @Body() shippingRequestBody) {
    return makeResponse(
      res,
      await this.upsService.generateShippingLabel(shippingRequestBody),
    );
  }

  @Get('api/v1/orders/events')
  @ApiBearerAuth('JWT-auth')
  async getOrderEvents(
    @Res() res,
    @Query() filter: PaginationDto,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.getOrderEvents(filter, token),
    );
  }
}
