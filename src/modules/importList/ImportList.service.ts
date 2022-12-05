import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  getImportedProductsHandler,
  importProductsHandler,
} from 'src/graphql/handlers/importList';
import { ProductFilterDto } from 'src/modules/product/dto';
import { importProductsDTO } from './dto/products';

@Injectable()
export class ImportListService {
  /**
   * Get products list from PIM
   */
  public async getImportedProduct(
    shopId: string,
    filter: ProductFilterDto,
  ): Promise<object> {
    try {
      return prepareGQLPaginatedResponse(
        await getImportedProductsHandler(shopId, filter),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
  /**
   * add product and variants against shop in importList
   */
  public async importProducts(
    productsData: importProductsDTO,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(await importProductsHandler(productsData));
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
}
