import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './Payment.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';

@ApiTags('checkout/payment')
@Controller('')
export class PaymentController {
  constructor(private readonly appService: PaymentService) {}
  @Post('checkout/payment/create')
  // TODO DTO missing
  async createPayment(@Res() res, @Body() body): Promise<object> {
    const { userEmail, userName, payment_methodID } = body;
    return makeResponse(
      res,
      await this.appService.createPayment(
        userName,
        userEmail,
        payment_methodID,
      ),
    );
  }

  @Post('checkout/payment/preauth')
  async preAuth(
    @Res() res,
    @Body() body, // TODO DTO missing
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail, paymentMethodId, checkoutID } = body;

    return makeResponse(
      res,
      await this.appService.paymentPreAuth(
        userEmail,
        paymentMethodId,
        checkoutID,
        token,
      ),
    );
  }

  @Get('checkout/cards/:userEmail')
  async getCards(@Res() res, @Param() params): Promise<object> {
    const { userEmail } = params;
    return makeResponse(
      res,
      await this.appService.getPaymentMethodsList(userEmail),
    );
  }
}
