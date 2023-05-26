import { Injectable, Logger } from '@nestjs/common';
import {
  OsBundlesType,
  OsOrderItem,
  OsOrderPayloadType,
  OsOrderTranformType,
  OsShippingAddressType,
} from './osOrder.types';
import {
  B2C_ORDER_TYPE,
  BASE_EXTERNAL_ENDPOINT,
  PAYMENT_TYPE,
  SHAROVE_BILLING_ADDRESS,
  SHAROVE_STRIPE_PAYMENT_METHOD,
  SHIPPING_METHOD,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  STORE_CREDIT,
} from 'src/constants';
import { saveFailedOrderHandler } from 'src/graphql/handlers/checkout/checkout';
import { prepareFailedResponse } from 'src/core/utils/response';
import { getTokenWithoutBearer } from 'src/modules/account/user/User.utils';
import axios from 'axios';
import { addShippingAddressInfo } from 'src/external/endpoints/checkout';
import { hash } from 'src/core/utils/helpers';
import {
  getClosestShoePackSize,
  getSelectedPackQuantity,
  getUniqueOrderItems,
} from './osOrder.utils';

@Injectable()
export default class OsOrderService {
  private readonly logger = new Logger(OsOrderService.name);
  private readonly API_URI: string = `${BASE_EXTERNAL_ENDPOINT}/api/v3`;

  /**
   * @description -- this method directly place order on orangeshine as retailer
   * @param payload -- order data
   * @param email -- user email
   * @param orderId -- reference order id
   * @param token -- user b2b authorization token
   * @return response with order details
   */
  public async placeOrder(
    payload: OsOrderPayloadType,
    email: string,
    orderId: string,
    token: string,
  ): Promise<object> {
    try {
      const URL = `${this.API_URI}/check-out/`;
      const header = {
        headers: { Authorization: getTokenWithoutBearer(token) },
      };
      const response = await axios.post(URL, payload, header);
      this.logger.log('Order placed on orangeshine', {
        orderId: orderId,
        response: response?.data,
      });
      return response?.data;
    } catch (err) {
      this.logger.error(err);
      await saveFailedOrderHandler(
        {
          email: email,
          source: orderId,
          orderId: orderId,
          exception: JSON.stringify(err),
          errorShortDesc: err.message,
          orderPayload: payload,
        },
        token,
      );
      return prepareFailedResponse(err.message);
    }
  }

  async createShippingAddress(shippingAddressInfo: OsShippingAddressType) {
    const response = await addShippingAddressInfo(shippingAddressInfo);
    return response;
  }

  async getBundles(productIds: string[]): Promise<OsBundlesType[]> {
    const URL = `${this.API_URI}/styles/details?pids=${JSON.stringify(
      productIds,
    )}`;
    const response = await axios.get(URL);
    return response?.data;
  }

  /**
   * @description -- this function takes orangeshine order details and transform data
   * for orangeshine order payload
   * @param b2cProducts - B2C products list for order on orangeshine
   * @param osProductMapping - orangeshine product ids against b2b product ids
   * @param b2bProductMapping - b2b product ids against b2c product ids
   * @param OsShippingAddressId - orangeshine user shipping address id
   * @param osProductsBundles - orangeshine bundles array against orangeshine product ids
   * @return payload for orangeshine order
   */
  transformOrderPayload({
    orderNumber,
    b2cProducts,
    osProductMapping,
    b2bProductMapping,
    OsShippingAddressId,
    osProductsBundles,
  }: OsOrderTranformType) {
    const osOrderItems: OsOrderItem[] = [];
    b2cProducts?.forEach((product) => {
      const osProductId = osProductMapping.get(
        b2bProductMapping.get(product.id),
      );
      const osBundles = hash(osProductsBundles, 'id');
      const osProductBundle = osBundles[osProductId];
      const osProductBundleColors = hash(osProductBundle?.colors, 'name');
      const selectedProductColorId =
        osProductBundleColors[product?.color]?.color_id;
      const selectedPackQuantity = getSelectedPackQuantity(
        osProductBundle,
        product,
      );

      if (selectedProductColorId && selectedPackQuantity) {
        osOrderItems.push({
          item_id: osProductId,
          color_id: selectedProductColorId,
          pack_qty: selectedPackQuantity,
          stock_type: 'in_stock',
          memo: '',
          sms_number: SMS_NUMBER,
          spa_id: OsShippingAddressId,
          spm_name: SHIPPING_METHOD,
          store_credit: STORE_CREDIT,
          signature_requested: SIGNATURE_REQUESTED,
          ...(osProductBundle?.is_shoes && {
            shoe_size_id: getClosestShoePackSize(osProductBundle, product)?.id,
          }),
        });
      }
    });

    const osOrderPayload: OsOrderPayloadType = {
      orders: getUniqueOrderItems(osOrderItems),
      sharove_order_id: orderNumber,
      stripe_payment_method_id: SHAROVE_STRIPE_PAYMENT_METHOD,
      spa_id: OsShippingAddressId,
      payment_type: PAYMENT_TYPE,
      billing: SHAROVE_BILLING_ADDRESS,
      order_type: B2C_ORDER_TYPE,
    };

    return osOrderPayload;
  }
}
