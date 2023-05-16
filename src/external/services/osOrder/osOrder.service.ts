import { Injectable, Logger } from '@nestjs/common';
import { OsOrderPayloadType } from './osOrder.types';
import { BASE_EXTERNAL_ENDPOINT } from 'src/constants';
import { saveFailedOrderHandler } from 'src/graphql/handlers/checkout/checkout';
import { prepareFailedResponse } from 'src/core/utils/response';
import { getTokenWithoutBearer } from 'src/modules/account/user/User.utils';
import axios from 'axios';

@Injectable()
export default class OsOrderService {
  private readonly logger = new Logger(OsOrderService.name);
  private readonly API_URI: string = `${BASE_EXTERNAL_ENDPOINT}/api/v3`;

  public async placeOrder(
    payload: OsOrderPayloadType,
    token: string,
  ): Promise<object> {
    try {
      const URL = `${this.API_URI}/check-out/`;
      const header = {
        headers: { Authorization: getTokenWithoutBearer(token) },
      };
      console.log('payload', payload);
      console.log('header', header);
      const response = await axios.post(URL, payload, header);
      console.log('response', response);
      return response?.data;
    } catch (err) {
      this.logger.error(err);
      await saveFailedOrderHandler(
        {
          source: '',
          orderId: '',
          exception: JSON.stringify(err),
          errorShortDesc: err.message,
          orderPayload: payload,
        },
        token,
      );
      return prepareFailedResponse(err.message);
    }
  }

  async getOsColorMappingIDs(colorObject) {
    const URL = `${this.API_URI}/product/details?color-mapping=${JSON.stringify(
      colorObject,
    )}`;
    console.log('URL', URL);
    const response = await axios.get(URL);
    const colorsData = response?.data?.data;
    return colorsData;
  }
}
