import { Injectable, Logger } from '@nestjs/common';
import qs from 'qs';
import { UPS_CONFIGURATIONS, UPS_URL } from 'src/constants';
import http from 'src/core/proxies/restHandler';

@Injectable()
export default class UpsService {
  private readonly logger = new Logger(UpsService.name);
  private async getAccessToken() {
    try {
      const restUrl = `${UPS_URL}/security/v1/oauth/token`;
      const permissionRequest = qs.stringify({
        grant_type: 'client_credentials',
      });
      const response = await http.post(
        restUrl,
        permissionRequest,
        UPS_CONFIGURATIONS,
      );
      return response?.data?.access_token;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async generateShippingLabel(shippingRequestBody) {
    try {
      const restUrl = `${UPS_URL}/api/shipments/v1/ship`;
      const header = {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await http.post(
        restUrl,
        JSON.stringify(shippingRequestBody),
        header,
      );
      return response?.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
