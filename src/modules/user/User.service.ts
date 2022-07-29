import { Injectable } from '@nestjs/common';
import { checkoutHandler } from 'src/graphql/handlers/users/checkout';
import { shoppingCartHandler } from 'src/graphql/handlers/users/shoppingCart';

@Injectable()
export class UserService {
  public getCheckoutData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // checkoutHandler is graphQl promise handler --->
    return checkoutHandler();
  }
  public getShoppingCartData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // checkoutHandler is graphQl promise handler --->
    return shoppingCartHandler();
  }
}
