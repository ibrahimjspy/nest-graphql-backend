import { Injectable, Logger } from '@nestjs/common';
import {
  NoBundleFoundError,
  SelectBundleError,
  UnSelectBundleError,
} from '../../Checkout.errors';
import { ProductBundlesResponseType } from './saleor/Cart.saleor.types';

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
    bundles: ProductBundlesResponseType,
    throwException = true,
  ) {
    if (bundles.status !== 200) {
      if (throwException) throw new NoBundleFoundError();
      return false;
    }
    return true;
  }

  /**
   * @description -- it validates  multiple responses to check if there are positive or not
   * @pre_condition -- currently this method only supports get methods which uses 200 status as ok
   */
  public validateApisByStatus(responses, throwException = true) {
    let isValid = true;
    console.log(responses);
    responses.map((response) => {
      if (response.status !== 200) {
        if (throwException) throw new NoBundleFoundError();
        isValid = false;
      }
      isValid = true;
    });
    return isValid;
  }
}
