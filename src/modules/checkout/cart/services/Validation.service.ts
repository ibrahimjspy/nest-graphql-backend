import { Injectable, Logger } from '@nestjs/common';
import {
  NoBundleFoundError,
  SelectBundleError,
  UnSelectBundleError,
} from '../../Checkout.errors';

@Injectable()
export class CartValidationService {
  private readonly logger = new Logger(CartValidationService.name);

  /**
   * @description --this method validates if any of checkout bundles are all ready selected, if so it returns an error
   */
  public async validateSelectBundles(checkoutBundles, throwException = true) {
    let isValid = true;
    checkoutBundles.map((checkoutBundle) => {
      if (checkoutBundle.isSelected == true) {
        if (throwException) {
          throw new SelectBundleError();
        }
        isValid = false;
      }
    });
    return isValid;
  }

  /**
   * @description --this method validates if any of checkout bundles are all ready un selected, if so it returns an error
   */
  public async validateUnSelectBundles(checkoutBundles, throwException = true) {
    let isValid = true;
    checkoutBundles.map((checkoutBundle) => {
      if (checkoutBundle.isSelected == false) {
        if (throwException) {
          throw new UnSelectBundleError();
        }
        isValid = false;
      }
    });
    return isValid;
  }

  /**
   * @description -- it for validating array length
   */
  public isEmptyList(saleorLines) {
    return saleorLines.length;
  }

  /**
   * @description -- it validates get bundles response that is fetched from product service
   */
  public validateBundlesByStatus(
    bundles: { status: 200 | 400 | 500 },
    throwException = true,
  ) {
    if (bundles.status !== 200) {
      if (throwException) throw new NoBundleFoundError();
      return false;
    }
    return true;
  }
}
