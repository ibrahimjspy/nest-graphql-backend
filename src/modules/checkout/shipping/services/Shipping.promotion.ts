import { Injectable, Logger } from '@nestjs/common';
import { SaleorCheckoutService } from '../../services/Checkout.saleor';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { getShippingVouchersHandler } from 'src/graphql/handlers/checkout/shipping';
import { vouchersType } from './Shipping.promotion.types';

@Injectable()
export class ShippingPromotionService {
  private readonly logger = new Logger(ShippingPromotionService.name);
  constructor(private saleorCheckoutService: SaleorCheckoutService) {
    return;
  }
  /**
   * @description -- this method adds a billing address against checkout id , it is currently storing this in saleor
   */
  public async applyPromoCodeToCheckout(
    checkoutId: string,
    token,
  ): Promise<object> {
    try {
      const checkout = await this.saleorCheckoutService.getCheckout(
        checkoutId,
        token,
      );
      const checkoutTotalPrice = checkout['totalPrice']['gross']['amount'];
      const voucher = await getShippingVouchersHandler(token);
      const voucherCode = this.getVoucherIdForCheckout(
        checkoutTotalPrice,
        voucher,
      );
      return prepareSuccessResponse(checkout, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method returns voucher code that should by applied to checkout if any
   * @step - it maps over all voucher code and returns code that has biggest minimum order amount which is smaller that our checkout amount
   */
  public getVoucherIdForCheckout(
    checkoutAmount: number,
    vouchersData: vouchersType,
  ): string {
    let voucherCode: string;
    let voucherAmount: number;
    vouchersData?.edges?.map((voucher) => {
      const minimumOrderAmount =
        voucher?.node?.channelListings[0]?.minSpent?.amount;
      if (
        checkoutAmount > minimumOrderAmount &&
        minimumOrderAmount > voucherAmount
      ) {
        voucherCode = voucher?.node?.code;
        voucherAmount = minimumOrderAmount;
      }
    });
    return voucherCode;
  }
}
