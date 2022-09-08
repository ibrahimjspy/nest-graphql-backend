import { Injectable } from '@nestjs/common';
import {
  checkoutHandler,
  shoppingCartHandler,
  addToCartHandler,
} from 'src/graphql/handlers/user';

interface BundleTypes {
  bundleId: string;
  quantity: number;
}
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
  public addToCart(
    userId: string,
    bundles: Array<BundleTypes>,
  ): Promise<object> {
    return addToCartHandler(userId, bundles);
  }
}
