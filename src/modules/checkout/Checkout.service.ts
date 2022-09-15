import { Injectable } from '@nestjs/common';
import {
  getCheckoutHandler,
  addToCartHandler,
  deleteBundleFromCartHandler,
  updateBundleFromCartHandler,
  bundleSelectionHandler,
  shippingAddressHandler,
  billingAddressHandler,
  shippingBillingAddress,
  getShippingMethodHandler,
  selectShippingMethods,
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
  public setBundleAsSelected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    return bundleSelectionHandler(userId, bundleIds, true);
  }
  public setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    return bundleSelectionHandler(userId, bundleIds, false);
  }
  public addShippingAddress(checkoutId, addressDetails): Promise<object> {
    return shippingAddressHandler(checkoutId, addressDetails);
  }
  public addBillingAddress(checkoutId, addressDetails): Promise<object> {
    return billingAddressHandler(checkoutId, addressDetails);
  }
  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    return shippingBillingAddress(checkoutId);
  }
  public getShippingMethod(userId: string): Promise<object> {
    return getShippingMethodHandler(userId);
  }
  public selectShippingMethods(
    userId: string,
    shippingIds: Array<string>,
  ): Promise<object> {
    return selectShippingMethods(userId, shippingIds);
  }
}
