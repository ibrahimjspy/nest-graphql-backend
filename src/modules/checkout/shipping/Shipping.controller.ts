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
  Query,
  Res,
} from '@nestjs/common';
import { makeResponse } from 'src/core/utils/response';
import {
  BillingAddressDto,
  ShippingAddressCreateDto,
} from './dto/shippingAddress';
import { CheckoutIdDto } from '../dto/checkoutId';
import {
  GetShippingMethodsDto,
  SelectShippingMethodDto,
  UpdateShippingMethodPriceDto,
} from './dto/shippingMethods';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

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
  ): Promise<any> {
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

  @Get('api/v1/checkout/address/:checkoutId')
  @ApiOperation({
    summary: 'returns billing and shipping address against a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async getShippingAddress(
    @Res() res,
    @Param() params: CheckoutIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getCheckoutShippingAddress(
        params?.checkoutId,
        Authorization,
      ),
    );
  }

  @Get('api/v1/checkout/shipping/methods')
  @ApiOperation({
    summary: 'returns shipping address against a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async getShippingMethods(
    @Res() res,
    @Headers() headers,
    @Query() filter: GetShippingMethodsDto,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingMethods(filter, Authorization),
    );
  }

  @Put('api/v1/checkout/shipping/methods/select')
  @ApiOperation({
    summary: 'selects shipping method for a checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async selectShippingMethods(
    @Res() res,
    @Body() body: SelectShippingMethodDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.selectShippingMethods(
        body?.checkoutId,
        body?.shippingMethodId,
        Authorization,
      ),
    );
  }

  @Get('api/v1/checkout/shipping/zones')
  @ApiOperation({
    summary: 'returns shipping zones that include shipping prices',
  })
  @ApiBearerAuth('JWT-auth')
  async getShippingZones(
    @Res() res,
    @Headers() headers,
    @Query() filter: PaginationDto,
  ): Promise<object> {
    const Authorization = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingZones(filter, Authorization),
    );
  }

  @Put('api/v1/checkout/shipping/method/price')
  @ApiOperation({
    summary: 'updates shipping method pricing against a channel',
  })
  @ApiBearerAuth('JWT-auth')
  async updateShippingPrice(
    @Res() res,
    @Headers() headers,
    @Body() body: UpdateShippingMethodPriceDto,
  ): Promise<object> {
    const Authorization = headers.authorization;
    return makeResponse(
      res,
      await this.appService.updateShippingMethodPrice(body, Authorization),
    );
  }
}
