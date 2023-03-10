import { Injectable, Logger } from '@nestjs/common';
import { SelectBundleError, UnSelectBundleError } from '../../Checkout.errors';

@Injectable()
export class CartValidationService {
  private readonly logger = new Logger(CartValidationService.name);

  /**
   * @description --this method validates if any of checkout bundles are all ready selected, if so it returns an error
   */
  public async validateSelectBundles(checkoutBundles) {
    try {
      checkoutBundles.map((checkoutBundle) => {
        if (checkoutBundle.isSelected == true) {
          throw new SelectBundleError();
        }
      });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * @description --this method validates if any of checkout bundles are all ready un selected, if so it returns an error
   */
  public async validateUnSelectBundles(checkoutBundles) {
    try {
      checkoutBundles.map((checkoutBundle) => {
        if (checkoutBundle.isSelected == false) {
          throw new UnSelectBundleError();
        }
      });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
