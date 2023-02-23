import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './Payment.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { UserIdDto } from '../dto';
import { PaymentCreateDto, PaymentPreAuthDto } from './dto/paymentCreate';

@ApiTags('checkout/payment')
@Controller('')
export class PaymentController {
  constructor(private readonly appService: PaymentService) {}
  @Post('checkout/payment/create')
  @ApiBearerAuth('JWT-auth')
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

  @Post('checkout/payment/preauth')
  @ApiBearerAuth('JWT-auth')
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

  @Get('checkout/cards/:userEmail')
  async getCards(@Res() res, @Param() params: UserIdDto): Promise<object> {
    const { userEmail } = params;
    return makeResponse(
      res,
      await this.appService.getPaymentMethodsList(userEmail),
    );
  }
}
