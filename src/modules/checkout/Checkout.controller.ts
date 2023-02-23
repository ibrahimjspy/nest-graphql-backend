import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { B2BClientPlatform } from 'src/constants';
import { UserIdDto } from './dto';
import { CheckoutIdDto } from './dto/checkoutId';

@ApiTags('checkout')
@Controller('')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {
    return;
  }

  @Post('api/v1/checkout')
  @ApiOperation({
    summary:
      'this creates a checkout session against a user email and returns checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async createCheckout(
    @Res() res,
    @Body() body: UserIdDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const typeMethod =
      {
        [B2BClientPlatform]: this.appService.createAdminCheckout,
      }[body.userEmail] || this.appService.createCheckout;
    return makeResponse(
      res,
      await typeMethod.call(this.appService, body.userEmail, token),
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
}
