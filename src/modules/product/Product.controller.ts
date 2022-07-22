import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './Product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly appService: ProductService) {}
  // Returns default cards data  <All>
  @Get('/cards')
  findDefaultCards(): Promise<object> {
    return this.appService.getProducts();
  }
  // Returns cards data relating to category and collection by <id>
  @Get('/cardsByCollectionId/:id')
  findProductCardsByCollectionId(@Param() params): Promise<object> {
    return this.appService.getProductsByCollections(params.id);
  }
  // Returns single product details by <slug>
  @Get('details/:slug')
  findProductDetailsBySlug(@Param() params): Promise<object> {
    return this.appService.getProductDetailsBySlug(params.slug);
  }
  // Returns product list page data relating to category <slug>
  @Get('list/:slug')
  findProductListBySlug(@Param() params): Promise<object> {
    return this.appService.getProductListPageBySlug(params.slug);
  }
}
