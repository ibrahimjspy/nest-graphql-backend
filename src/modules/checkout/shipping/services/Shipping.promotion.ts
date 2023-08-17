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
import {
  FREE_SHIPPING_VOUCHER_CODE,
  PROMOTION_SHIPPING_METHOD_ID,
} from 'src/constants';
import { preparePromotionResponse } from './Shipping.response';
import { getUserOrderCountHandler } from 'src/graphql/handlers/account/user';
import { isFreeShippingOrder } from '../../Checkout.utils';

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
      const userOrderCount = await getUserOrderCountHandler(token);
      if (isFreeShippingOrder(userOrderCount)) {
        return await this.addFreeShippingPromo(checkoutId, token);
      }
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

  /**
   * Adds a free shipping promo code to the checkout and prepares a response.
   *
   * @param {string} checkoutId - The ID of the checkout where the promo code will be added.
   * @param {string} token - The authorization token.
   * @returns {object} A success response indicating that the checkout promo code was added and a shipping method was selected.
   * @remarks The free shipping voucher code should be the same for the system to apply it. This function assumes that the promo code is created with the value '00FS00'.
   * @example
   * // Adding a free shipping promo code to the checkout
   * const checkoutId = '123456';
   * const authToken = 'your_auth_token';
   * const response = await addFreeShippingPromo(checkoutId, authToken);
   * console.log(response); // Success response
   */
  public async addFreeShippingPromo(checkoutId: string, token: string) {
    this.logger.log(
      'Applying free shipping promo for first time user',
      checkoutId,
    );
    const addPromoCode = await addCheckoutPromoCodeHandler(
      checkoutId,
      FREE_SHIPPING_VOUCHER_CODE,
      token,
    );

    // Prepare and return the success response
    return prepareSuccessResponse(
      addPromoCode,
      'Free shipping Checkout promo code added and shipping method selected',
      201,
    );
  }
}
