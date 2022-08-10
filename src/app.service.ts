import { Injectable } from '@nestjs/common';
import { fetchMock } from '../test/graphql/test';

@Injectable()
export class AppService {
  async getHello(): Promise<object> {
    return await fetchMock();
  }
}
