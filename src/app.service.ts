import { Injectable } from '@nestjs/common';
import { request } from 'graphql-request';
import { rickQuery } from './queries';
// import { getHeapStatistics } from 'v8';
const testFunction = () => {
  return 'Im random testify';
};
@Injectable()
export class AppService {
  async getHello(): Promise<object> {
    let Data = {};
    await request('https://rickandmortyapi.com/graphql', rickQuery(3)).then(
      (data) => (Data = data),
    );
    return { Data };
  }
  getHi(): string {
    return testFunction();
  }
  getId(param: string): string {
    return `hi I am service method ${param}`;
  }
}
