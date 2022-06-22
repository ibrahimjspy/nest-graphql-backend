import { Injectable } from '@nestjs/common';
import { fetchMock } from './handlers/test';
// import { getHeapStatistics } from 'v8';
const testFunction = () => {
  return 'Im random test functions';
};
@Injectable()
export class AppService {
  async getHello(): Promise<object> {
    return await fetchMock();
  }
  getHi(): string {
    return testFunction();
  }
  getId(param: string): string {
    return `hi I am service method ${param}`;
  }
}
