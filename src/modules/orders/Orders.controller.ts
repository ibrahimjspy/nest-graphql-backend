import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';
import { makeResponse } from '../../core/utils/response';
import { OrderIdDto, ShopIdDto, UserIdDto } from './dto';
import { OrderSummaryDto } from './dto/common.dto';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { OrdersListDTO } from './dto/list';

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
    @Query() filter: PaginationDto,
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

  // Returns orders summary ()
  @Get('orders/summary/:reportingPeriod?')
  async findOrdersSummary(
    @Res() res,
    @Param() orderSummaryDto: OrderSummaryDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrdersSummary(
        orderSummaryDto.reportingPeriod,
        Authorization,
      ),
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
}
