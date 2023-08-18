import { Injectable, Logger } from '@nestjs/common';
import {
  addLinesHandler,
  deleteLinesHandler,
  updateLinesHandler,
} from 'src/graphql/handlers/checkout/cart/cart.saleor';
import {
  CheckoutLinesInterface,
  ProductBundlesResponseType,
} from './Cart.saleor.types';
import { MarketplaceCartService } from '../marketplace/Cart.marketplace.service';
import {
  getAddBundleToCartLines,
  getBundleIds,
  getClosePackLinesReplace,
  getDeleteBundlesLines,
  getOpenPackLinesReplace,
  getOpenPackLinesUpdate,
  getOpenPackTransactionType,
  getUpdateCartBundleLines,
} from '../../Cart.utils';
import { SaleorCheckoutService } from 'src/modules/checkout/services/Checkout.saleor';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { ProductService } from 'src/modules/product/Product.service';
import { CartValidationService } from '../Validation.service';
import { SaleorCheckoutInterface } from 'src/modules/checkout/Checkout.utils.type';
import { ReplaceBundleDto, UpdateOpenPackDto } from '../../dto/cart';
import { OpenPackTransactionTypeEnum } from '../../dto/common.dto';

@Injectable()
export class SaleorCartService {
  private readonly logger = new Logger(SaleorCartService.name);

  constructor(
    private marketplaceService: MarketplaceCartService,
    private saleorCheckoutService: SaleorCheckoutService,
    private cartValidationService: CartValidationService,
    private productService: ProductService,
  ) {}

  public async addLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
    throwException = true,
  ) {
    try {
      this.logger.log(`Adding lines to cart ${checkoutId}`, checkoutLines);
      return await addLinesHandler(checkoutId, checkoutLines, token);
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }

  public async updateLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
    throwException = true,
  ) {
    try {
      this.logger.log(`Updating checkout lines ${checkoutId}`, checkoutLines);

      const response = await updateLinesHandler(
        checkoutId,
        checkoutLines,
        token,
      );
      return response['checkout'];
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }

  public async deleteLines(
    checkoutId: string,
    lineIds: string[],
    token: string,
    throwException = true,
  ) {
    try {
      this.logger.log(`Updating checkout lines ${checkoutId}`, lineIds);

      return await deleteLinesHandler(checkoutId, lineIds, token);
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }
  public async createCheckoutFromBundleLines(
    userEmail: string,
    checkoutLines,
    token: string,
  ) {
    this.logger.log(`Creating checkout from bundle lines`);

    const createCheckout = await this.saleorCheckoutService.createCheckout(
      userEmail,
      checkoutLines,
      token,
    );
    return createCheckout;
  }

  public async addBundleLines(
    userEmail: string,
    checkoutId: string,
    checkoutBundleLines: CheckoutBundleInputType[],
    token: string,
    createBundlesData?: object,
  ): Promise<SaleorCheckoutInterface> {
    const bundleIds = getBundleIds(checkoutBundleLines);
    let bundlesData = createBundlesData;
    if (!bundlesData) {
      this.logger.log('Fetching bundles in saleor service');
      bundlesData = await this.productService.getProductBundles({
        bundleIds: bundleIds,
        getProductDetails: false,
        first: 100,
      });
    }

    this.cartValidationService.validateBundlesByStatus(
      bundlesData as ProductBundlesResponseType,
    );
    const saleorLines: CheckoutLinesInterface = getAddBundleToCartLines(
      bundlesData['data'],
      checkoutBundleLines,
    );
    if (!this.cartValidationService.isEmptyList(saleorLines)) {
      return;
    }
    if (!checkoutId) {
      return await this.createCheckoutFromBundleLines(
        userEmail,
        saleorLines,
        token,
      );
    }
    const response = await this.addLines(checkoutId, saleorLines, token);
    // TODO remove this call after marketplace service start to persist checkout id
    return response as SaleorCheckoutInterface;
  }

  public async updateBundleLines(
    checkoutId: string,
    checkoutBundles,
    updatedCheckoutBundles: CheckoutLinesInterface,
    token: string,
  ) {
    if (
      !(await this.cartValidationService.validateUnSelectBundles(
        checkoutBundles,
        false,
      ))
    ) {
      return;
    }

    const checkoutLines = getUpdateCartBundleLines(
      checkoutBundles,
      updatedCheckoutBundles,
    );
    this.logger.log(
      `Updating checkout lines against ${checkoutId}`,
      checkoutLines,
    );
    return await this.updateLines(checkoutId, checkoutLines, token);
  }

  public async removeBundleLines(
    checkoutId: string,
    checkoutBundlesData,
    token: string,
  ) {
    const saleorCheckout = await this.saleorCheckoutService.getCheckout(
      checkoutId,
      token,
    );
    const updatedSaleorLines = getDeleteBundlesLines(
      saleorCheckout['lines'],
      checkoutBundlesData,
    );
    if (!this.cartValidationService.isEmptyList(updatedSaleorLines)) {
      return;
    }
    this.logger.log(
      `Updating checkout lines against ${checkoutId}`,
      updatedSaleorLines,
    );
    return this.updateLines(checkoutId, updatedSaleorLines, token);
  }

  public async handleOpenPackUpdates(
    openPackUpdates: UpdateOpenPackDto,
    token: string,
  ) {
    const { checkoutId, variants, bundleId } = openPackUpdates;
    const [bundle, saleor] = await Promise.all([
      this.productService.getBundle(bundleId),
      this.saleorCheckoutService.getCheckout(checkoutId, token),
    ]);
    this.cartValidationService.validateApisByStatus([bundle]);
    const openPackTransactionType = getOpenPackTransactionType(openPackUpdates);
    if (openPackTransactionType === OpenPackTransactionTypeEnum.UPDATE) {
      const checkoutLines = getOpenPackLinesUpdate(variants, bundle, saleor);
      this.logger.log(
        `Updating checkout lines against ${checkoutId} in open pack update case`,
        checkoutLines,
      );
      return await this.updateLines(checkoutId, checkoutLines, token, true);
    }
    const checkoutLines = getOpenPackLinesReplace(
      openPackUpdates,
      bundle,
      saleor,
    );
    this.logger.log(
      `Updating checkout lines against ${checkoutId} in open pack replace case`,
      checkoutLines,
    );
    return await this.updateLines(checkoutId, checkoutLines, token, true);
  }

  /**
   * Handles the replacement of a bundle in the checkout.
   *
   * @param {ReplaceBundleDto} replaceBundles - The replacement bundle details.
   * @param {string} token - The authentication token.
   * @returns {Promise<ReturnTypeOfUpdateLines>} - The result of updating the checkout lines.
   */
  public async handleClosePackReplace(
    replaceBundles: ReplaceBundleDto,
    token: string,
  ) {
    const { newBundleId, checkoutBundleId, userEmail } = replaceBundles;

    // Retrieve the checkout bundle data and checkout ID
    const { checkoutId, checkoutBundlesData } =
      await this.marketplaceService.getCheckoutBundlesByIds(
        userEmail,
        [checkoutBundleId],
        token,
      );

    // Retrieve the new bundle and saleor checkout data
    const [bundle, saleor] = await Promise.all([
      this.productService.getBundle(newBundleId),
      this.saleorCheckoutService.getCheckout(checkoutId, token),
    ]);

    // Calculate the updated checkout lines
    const updatedLines = getClosePackLinesReplace(
      checkoutBundlesData[0],
      bundle,
      saleor,
    );
    if (!updatedLines) return;
    this.logger.log(
      'Updating checkout lines after close pack replace',
      updatedLines,
    );

    // Update the checkout lines
    return await this.updateLines(checkoutId, updatedLines, token, true);
  }
}
