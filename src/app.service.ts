import { Injectable } from '@nestjs/common';
import { prepareSuccessResponse } from './core/utils/response';

@Injectable()
export class AppService {
  async getHealthCheck(): Promise<object> {
    return prepareSuccessResponse(null, 'Ok');
  }
}
