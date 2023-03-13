import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './Payment.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { UserIdDto } from '../dto';
import { PaymentCreateDto, PaymentPreAuthDto } from './dto/paymentCreate';
import StripeService from 'src/external/services/stripe';

@ApiTags('checkout/payment')
@Controller('')
export class PaymentController {
  constructor(
    private readonly appService: PaymentService,
    private stripeService: StripeService,
  ) {}

  @Post('api/v1/checkout/payment')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'creates a payment against a user',
  })
  async createPayment(
    @Res() res,
    @Body() body: PaymentCreateDto,
  ): Promise<object> {
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

  @Post('api/v1/checkout/payment/preauth')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'creates a payment preauth against a user',
  })
  async preAuth(
    @Res() res,
    @Body() body: PaymentPreAuthDto,
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

  @Get('api/v1/checkout/payment/methods/:userEmail')
  @ApiOperation({
    summary: 'returns payment methods list against a user',
  })
  async getCards(@Res() res, @Param() params: UserIdDto): Promise<object> {
    const { userEmail } = params;
    return makeResponse(
      res,
      await this.appService.getPaymentMethodsList(userEmail),
    );
  }

  @Get('api/v1/checkout/payment/methods/test')
  @ApiOperation({
    summary: 'creates a payment method for testing',
  })
  async createPaymentMethod(@Res() res): Promise<object> {
    return makeResponse(res, await this.stripeService.createPaymentMethods());
  }
}
