import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @Post('api/v1/checkout/shipping/address')
  @ApiOperation({
    summary: 'adds shipping address against checkout id',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Post('api/v1/checkout/billing/address')
  @ApiOperation({
    summary: 'adds billing address against checkout id',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Get('api/v1/checkout/address')
  @ApiOperation({
    summary: 'returns billing and shipping address against a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Get('api/v1/checkout/shipping/address')
  @ApiOperation({
    summary: 'returns shipping address against a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Put('api/v1/checkout/shipping/methods/select')
  @ApiOperation({
    summary: 'selects shipping address for a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
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
