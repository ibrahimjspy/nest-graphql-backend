import { Injectable } from '@nestjs/common';
import { checkoutHandler } from 'src/graphql/handlers/users/checkout';

@Injectable()
export class UserService {
  public getShoppingCartData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return checkoutHandler();
  }
}
