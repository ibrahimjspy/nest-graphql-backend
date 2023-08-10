import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './Payment.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { UserIdDto } from '../dto';
import {
  PaymentCreateDto,
  PaymentMethodDeleteDto,
  PaymentPreAuthDto,
  PaymentPreAuthV2Dto,
} from './dto/paymentCreate';
import StripeService from 'src/external/services/stripe';
import { PaymentMetadataDto } from './dto/paymentMetadata';

@ApiTags('checkout/payment')
@Controller('')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
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

  @Post('api/v1/checkout/payment/delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'delete a payment method against a user',
  })
  async deleteCreditCard(
    @Res() res,
    @Body() body: PaymentMethodDeleteDto,
  ): Promise<object> {
    const { paymentMethodId, userEmail } = body;
    return makeResponse(
      res,
      await this.appService.deletePaymentMethod(paymentMethodId, userEmail),
    );
  }

  @Post('api/v2/checkout/payment/preauth')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'creates a payment preauth against a user',
  })
  async preAuthV2(
    @Res() res,
    @Body() body: PaymentPreAuthV2Dto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail, paymentMethodId } = body;

    return makeResponse(
      res,
      await this.appService.preAuthV2(paymentMethodId, userEmail, token),
    );
  }

  @Post('api/v1/payment/metadata')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'stores payment metadata',
  })
  async addPaymentMetadata(
    @Res() res,
    @Body() body: PaymentMetadataDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.saveUserPaymentMetadata(body, token),
    );
  }
}
