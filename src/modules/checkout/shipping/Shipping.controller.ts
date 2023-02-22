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
import {
  BillingAddressDto,
  GetShippingMethodDto,
  SelectShippingAddressDto,
  ShippingAddressCreateDto,
} from './dto/shippingAddress';
import { CheckoutIdDto } from '../dto/checkoutId';

@ApiTags('checkout/shipping')
@Controller('')
export class ShippingController {
  constructor(private readonly appService: ShippingService) {}
  @Post('checkout/shippingAddress')
  async addShippingAddress(
    @Res() res,
    @Body() body: ShippingAddressCreateDto,
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
    @Body() body: BillingAddressDto,
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
    @Param() params: CheckoutIdDto,
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
    @Param() params: GetShippingMethodDto,
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
    @Body() body: SelectShippingAddressDto,
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
