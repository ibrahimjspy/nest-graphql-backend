import { ApiTags } from '@nestjs/swagger';
import { ShippingService } from './Shipping.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { makeResponse } from 'src/core/utils/response';

@ApiTags('checkout/payment')
@Controller('')
export class ShippingController {
  constructor(private readonly appService: ShippingService) {}
  @Post('checkout/shippingAddress')
  async addShippingAddress(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.addShippingAddress(
        body.checkoutId,
        body.addressDetails,
        body.shippingMethodId,
        Authorization,
      ),
    );
  }

  @Post('checkout/billingAddress')
  async addBillingAddress(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.addBillingAddress(
        body?.checkoutId,
        body?.addressDetails,
        Authorization,
      ),
    );
  }

  @Get('checkout/shippingAndBillingAddress/:checkoutId')
  async getShippingAndBillingAddress(
    @Res() res,
    @Param() params,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingAndBillingAddress(
        params?.checkoutId,
        Authorization,
      ),
    );
  }

  @Get('checkout/shippingMethods/:userId')
  async getShippingMethods(
    @Res() res,
    @Param() params,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingMethods(params?.userId, Authorization),
    );
  }

  @Put('checkout/shippingMethods/select')
  async selectShippingMethods(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.selectShippingMethods(
        body?.userId,
        body?.shippingIds,
        Authorization,
      ),
    );
  }
}
