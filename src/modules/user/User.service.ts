import { Injectable } from '@nestjs/common';
import {
  getCheckoutHandler,
  addToCartHandler,
  deleteBundleFromCartHandler,
  updateBundleFromCartHandler,
} from 'src/graphql/handlers/user';

interface BundleTypes {
  bundleId: string;
  quantity: number;
}
@Injectable()
export class UserService {
  public getCheckoutDataById(id: string): Promise<object> {
    return getCheckoutHandler(id);
  }
  public getShoppingCartDataById(id: string): Promise<object> {
    return getCheckoutHandler(id);
  }
  public addToCart(
    userId: string,
    bundles: Array<BundleTypes>,
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
