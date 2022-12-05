import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  getImportedProductsHandler,
  importProductsHandler,
} from 'src/graphql/handlers/import';
import { ProductFilterDto } from 'src/modules/product/dto';
import { importProductsDTO } from './dto/products';

@Injectable()
export class ImportService {
  /**
   * Get products list from PIM
   * @returns products list
   */
  public async getImportedProduct(
    filter: ProductFilterDto,
    shopId: string,
  ): Promise<object> {
    try {
      return prepareGQLPaginatedResponse(
        await getImportedProductsHandler(shopId, filter),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

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
