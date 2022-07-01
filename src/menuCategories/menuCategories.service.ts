import { Injectable } from '@nestjs/common';
import { MenuCategoriesHandler } from 'src/handlers/menuCategoriesHandler';

@Injectable()
export class MenuCategoriesService {
  public getCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return MenuCategoriesHandler(); //graphql function
  }
}
