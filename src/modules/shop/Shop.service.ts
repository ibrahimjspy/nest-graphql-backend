import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopService {
  public getBannerData(): string {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return 'banner data';
  }
}
