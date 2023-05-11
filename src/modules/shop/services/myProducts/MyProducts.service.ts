import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { removeB2cProductMapping } from 'src/external/endpoints/b2cMapping';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import {
  deleteBulkMediaHandler,
  deleteBulkProductHandler,
  getMyProductsHandler,
  getShopProductsHandler,
  updateMyProductHandler,
} from 'src/graphql/handlers/product';
import {
  getShopDetailsV2Handler,
  removeProductsFromShopHandler,
} from 'src/graphql/handlers/shop';
import {
  getShopProductIds,
  isEmptyArray,
} from 'src/modules/product/Product.utils';
import { getFieldValues, makeMyProductsResponse } from '../../Shop.utils';
import {
  myProductsDTO,
  removeMyProductsDto,
  updateMyProductDTO,
} from '../../dto/myProducts';

@Injectable()
export class MyProductsService {
  private readonly logger = new Logger(MyProductsService.name);

  public async getMyProducts(retailerId: string, filter: myProductsDTO) {
    try {
      let productIds: string[] = [];
      const retailer = await getShopDetailsV2Handler({ id: retailerId });
      const storefrontIds = getFieldValues(retailer['fields'], 'storefrontids');
      const B2C_API = true;
      let storeDetails;
      await Promise.all(
        (storefrontIds || []).map(async (storeId) => {
          const pagination = filter as PaginationDto;
          const shopProducts = await getShopProductsHandler(
            {
              ...pagination,
              storeId,
            },
            B2C_API,
          );
          storeDetails = shopProducts;
          const shopProductIds = getShopProductIds(shopProducts);
          productIds = productIds.concat(shopProductIds);
        }),
      );
      if (isEmptyArray(productIds)) {
        const productsList = makeMyProductsResponse(
          await getMyProductsHandler(productIds, { first: 10 }),
          storeDetails,
        );
        return prepareSuccessResponse([retailer, productsList]);
      }
      return prepareSuccessResponse(
        [retailer, []],
        'no products exists against given shop id',
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async removeProductsFromMyProducts(input: removeMyProductsDto, token) {
    try {
      const productIds = input.productIds;
      const storeId = input.storeId;
      const isB2c = true;
      const [saleor, mapping, multiVendor] = await Promise.all([
        deleteBulkProductHandler(productIds, token, isB2c),
        removeB2cProductMapping(productIds),
        removeProductsFromShopHandler(productIds, storeId, token, isB2c),
      ]);
      return prepareSuccessResponse({ saleor, mapping, multiVendor });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateMyProduct(
    updateMyProduct: updateMyProductDTO,
    token: string,
  ) {
    try {
      const mediaUpdate = await deleteBulkMediaHandler(
        updateMyProduct.removeMediaIds,
        token,
        true,
      );
      const response = await updateMyProductHandler(
        updateMyProduct,
        token,
        true,
      );
      return prepareSuccessResponse({ response, mediaUpdate }, '', 200);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
