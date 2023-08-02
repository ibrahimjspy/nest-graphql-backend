import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { B2BClientPlatform } from 'src/constants';
import { CheckoutIdDto, OsPlaceOrderDto } from './dto/checkoutId';
import { CreateCheckoutDto } from './dto/createCheckout';
import { UserIdDto } from './dto';

@ApiTags('checkout')
@Controller('')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {
    return;
  }

  @Get('api/v1/checkout/summary')
  @ApiOperation({
    summary: 'returns checkout summary against id',
  })
  @ApiBearerAuth('JWT-auth')
  async getCheckoutSummary(
    @Res() res,
    @Query() filter: CheckoutIdDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getCheckoutSummary(filter.checkoutId, token),
    );
  }

  @Post('api/v1/checkout')
  @ApiOperation({
    summary:
      'this creates a checkout session against a user email and returns checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async createCheckout(
    @Res() res,
    @Body() body: CreateCheckoutDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const typeMethod =
      {
        [B2BClientPlatform]: this.appService.createAdminCheckout,
      }[body.userEmail] || this.appService.createCheckout;
    return makeResponse(
      res,
      await typeMethod.call(this.appService, body, token),
    );
  }

  @Post('api/v1/checkout/complete')
  @ApiOperation({
    summary:
      'this completes checkout against checkout id in both Saleor and Shop service',
  })
  @ApiBearerAuth('JWT-auth')
  async checkoutComplete(
    @Res() res,
    @Body() body: CheckoutIdDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { checkoutId } = body;
    return makeResponse(
      res,
      await this.appService.checkoutComplete(token, checkoutId),
    );
  }

  @Post('api/v1/os/order/place')
  @ApiOperation({
    summary: 'Place order on orangeshine as sharove against B2C order',
  })
  @ApiBearerAuth('JWT-auth')
  async osPlaceOrder(
    @Res() res,
    @Body() body: OsPlaceOrderDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { orderId } = body;
    return makeResponse(
      res,
      await this.appService.osPlaceOrder(orderId, token),
    );
  }

  @Post('api/v2/checkout/complete')
  @ApiOperation({
    summary:
      'this completes checkout against all sessions of user in both Saleor and Shop service',
  })
  @ApiBearerAuth('JWT-auth')
  async checkoutCompleteV2(
    @Res() res,
    @Body() body: UserIdDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail } = body;
    return makeResponse(
      res,
      await this.appService.checkoutCompleteV2(token, userEmail),
    );
  }
}
