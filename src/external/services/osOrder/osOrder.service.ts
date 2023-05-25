import { Injectable, Logger } from '@nestjs/common';
import {
  OsBundlesType,
  OsOrderPayloadType,
  OsShippingAddressType,
} from './osOrder.types';
import { BASE_EXTERNAL_ENDPOINT } from 'src/constants';
import { saveFailedOrderHandler } from 'src/graphql/handlers/checkout/checkout';
import { prepareFailedResponse } from 'src/core/utils/response';
import { getTokenWithoutBearer } from 'src/modules/account/user/User.utils';
import axios from 'axios';
import { addShippingAddressInfo } from 'src/external/endpoints/checkout';

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
}
