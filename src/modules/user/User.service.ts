import { Injectable } from '@nestjs/common';
import {
  checkoutHandler,
  shoppingCartHandler,
} from 'src/graphql/handlers/user';

@Injectable()
export class UserService {
  public getCheckoutDataById(id: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // checkoutHandler is graphQl promise handler --->
    return checkoutHandler(id);
  }
  public getShoppingCartDataById(id: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // checkoutHandler is graphQl promise handler --->
    return shoppingCartHandler(id);
  }
}
