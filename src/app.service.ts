import { Injectable } from '@nestjs/common';
import { fetchMock } from './graphql/handlers/test';

@Injectable()
export class AppService {
  async getHello(): Promise<object> {
    return await fetchMock();
  }
}
