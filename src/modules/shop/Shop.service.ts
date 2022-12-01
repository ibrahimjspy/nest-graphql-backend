import { Injectable, Inject } from '@nestjs/common';
import { carouselHandler } from 'src/graphql/handlers/shop';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ShopService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public getCarouselData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return carouselHandler(this.request.headers.authorization);
  }
}
