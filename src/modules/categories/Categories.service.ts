import { Inject, Injectable } from '@nestjs/common';
import {
  menuCategoriesHandler,
  productCardSectionHandler,
} from 'src/graphql/handlers/categories';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class CategoriesService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly authorizationToken = this.request.headers.authorization;

  public getMenuCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return menuCategoriesHandler(this.authorizationToken);
  }
  public getProductSections(): Promise<object> {
    // Pre graphQl call actions and validations to get product collection categories  -->
    // << -- >>
    // productCardCollectionHandler is graphQl promise handler --->
    return productCardSectionHandler(this.authorizationToken);
  }
}
