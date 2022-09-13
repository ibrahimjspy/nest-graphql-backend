import { Injectable } from '@nestjs/common';
import {
  getCheckoutHandler,
  addToCartHandler,
  deleteBundleFromCartHandler,
  updateBundleFromCartHandler,
} from 'src/graphql/handlers/checkout';

@Injectable()
export class CheckoutService {
  public getShoppingCartData(id: string): Promise<object> {
    return getCheckoutHandler(id);
  }
  public addToCart(
    userId: string,
    bundles: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    return addToCartHandler(userId, bundles);
  }
  public deleteBundleFromCart(
    userId: string,
    checkoutBundleIds: Array<string>,
  ): Promise<object> {
    return deleteBundleFromCartHandler(userId, checkoutBundleIds);
  }
  public updateBundleFromCart(
    userId: string,
    bundles: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    return updateBundleFromCartHandler(userId, bundles);
  }
}
