import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { B2BClientPlatform } from 'src/constants';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {
    return;
  }

  @Post('create/checkout')
  async createCheckout(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const typeMethod =
      {
        [B2BClientPlatform]:
          this.appService.createCheckoutSharovePlatformService,
      }[body.userEmail] || this.appService.createCheckoutendConsumerService;
    return makeResponse(
      res,
      await typeMethod.call(this.appService, body.userEmail, token),
    );
  }

  @Post('complete')
  async checkoutComplete(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { checkoutId } = body;
    return makeResponse(
      res,
      await this.appService.checkoutComplete(token, checkoutId),
    );
  }
}
