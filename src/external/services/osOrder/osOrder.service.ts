import { Injectable, Logger } from '@nestjs/common';
import { OsOrderPayloadType, OsShippingAddressType } from './osOrder.types';
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
      const response = await axios.post(URL, payload, header);
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

  async getProductColorIDs(colorObject) {
    const URL = `${this.API_URI}/product/details?color-mapping=${JSON.stringify(
      colorObject,
    ).replaceAll('#', '')}`; // Todo need to resolve # including colors
    const response = await axios.get(URL);
    return response?.data?.data;
  }

  async getShoeSizeIDs(vendorNameList: string[], shoeSizeNameList: string[]) {
    const URL = `${
      this.API_URI
    }/product/shoe-sizes?vendor_name_list=${JSON.stringify(
      vendorNameList,
    )}&shoe_size_name_list=${JSON.stringify(shoeSizeNameList)}`;
    const response = await axios.get(URL);
    return response?.data?.data;
  }

  async createShippingAddress(shippingAddressInfo: OsShippingAddressType) {
    const response = await addShippingAddressInfo(shippingAddressInfo);
    return response;
  }

  async getBundles(productIds: string[]) {
    const URL = `${this.API_URI}/styles/details?pids=${JSON.stringify(
      productIds,
    )}`;
    const response = await axios.get(URL);
    return response?.data;
  }
}
