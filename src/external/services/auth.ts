import { Logger } from '@nestjs/common';
import http from 'src/core/proxies/restHandler';

export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private BASE_URL: string;

  constructor(base_endpoint: string) {
    this.BASE_URL = base_endpoint;
  }

  public async getToken(email: string, password: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const URL = `${this.BASE_URL}/auth/token`;
      const bodyParameters = {
        email: email,
        password: password,
      };

      const resp = await http.post(URL, bodyParameters);
      return resp?.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
