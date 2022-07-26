import { Injectable } from '@nestjs/common';
import { carouselHandler } from 'src/graphql/handlers/shop/carousel';

@Injectable()
export class ShopService {
  public getCarouselData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return carouselHandler();
  }
}
