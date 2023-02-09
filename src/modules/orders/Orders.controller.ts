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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { OrderRefundDTO } from './dto/refund';
import { shopIdDTO } from '../shop/dto/shop';

@ApiTags('orders')
@Controller('')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
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
        token,
      ),
    );
  }

  @Post('api/v1/order/refund')
  @ApiOperation({
    summary: 'api to refund order lines both fulfilled and unfulfilled',
  })
  async refundOrder(
    @Res() res,
    @Body() orderDto: OrderRefundDTO,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.orderRefund(orderDto, token),
    );
  }

  @Post('api/v1/order/cancel')
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

  @Get('api/v1/orders/returns/filter')
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
}
