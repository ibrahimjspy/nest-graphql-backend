import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  public getDashboardData(): string {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return 'dashboard data';
  }
}
