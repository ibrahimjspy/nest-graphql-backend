import { Injectable, Logger } from '@nestjs/common';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  addCheckoutPromoCodeHandler,
  getShippingVouchersHandler,
  removeCheckoutPromoCodeHandler,
} from 'src/graphql/handlers/checkout/shipping';
import {
  UpdateDeliveryMethodInterface,
  vouchersType,
} from './Shipping.promotion.types';
import { PROMOTION_SHIPPING_METHOD_ID } from 'src/constants';
import { preparePromotionResponse } from './Shipping.response';

@Injectable()
export class ShippingPromotionService {
  private readonly logger = new Logger(ShippingPromotionService.name);
  constructor() {
    return;
  }
  /**
   * @description --  this method fetches applies shipping promo code to checkout based on checkout total amount
   */
  public async applyPromoCodeToCheckout(
    checkoutData: UpdateDeliveryMethodInterface,
    token: string,
  ): Promise<object> {
    try {
      const {
        id: checkoutId,
        subtotalPrice: {
          gross: { amount: checkoutSubTotalPrice },
        },
        discount: { amount: discountAmount },
        deliveryMethod: { id: checkoutDeliveryMethod },
        voucherCode,
      } = checkoutData;
      this.logger.log('Applying promotion code to checkout', checkoutId);

      const vouchersData = await getShippingVouchersHandler(token);
      const promoCode = this.getVoucherIdForCheckout(
        checkoutSubTotalPrice + (discountAmount || 0),
        vouchersData,
      );
      const existingVoucherCode = voucherCode || promoCode;
      if (promoCode && checkoutDeliveryMethod == PROMOTION_SHIPPING_METHOD_ID) {
        this.logger.log(
          `Adding voucher code ${promoCode} to checkout ${checkoutId}`,
        );
        const addPromoCode = await addCheckoutPromoCodeHandler(
          checkoutId,
          promoCode,
          token,
        );
        return prepareSuccessResponse(
          preparePromotionResponse(addPromoCode),
          'checkout promo code added and shipping method selected',
          201,
        );
      }

      this.logger.log(
        `Removing voucher code ${existingVoucherCode} from checkout ${checkoutId}`,
      );
      return prepareSuccessResponse(
        preparePromotionResponse(
          await removeCheckoutPromoCodeHandler(
            checkoutId,
            existingVoucherCode || promoCode,
            token,
          ),
        ),
        'no promo code added against shipping method created',
        201,
      );
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
    let voucherAmount = 0;
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

    this.logger.log(
      `Voucher code ${voucherCode} is applicable to checkout amount ${checkoutAmount}`,
    );
    return voucherCode;
  }
}
