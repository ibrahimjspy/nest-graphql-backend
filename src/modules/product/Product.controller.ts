import { Controller, Get, Post, Param, Body } from '@nestjs/common';
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
  @Get('/cardsByCategoryId/:id')
  findProductCardsByCategoryId(@Param() params): Promise<object> {
    return this.appService.getProductsByCategory(params.id);
  }
  // Returns single product details by <slug>
  @Get('details/:slug')
  findProductDetailsBySlug(@Param() params): Promise<object> {
    return this.appService.getProductDetailsBySlug(params.slug);
  }
  // Returns product list page data relating to category <slug>
  @Get('list/:id')
  findProductListById(@Param() params): Promise<object> {
    return this.appService.getProductListPageById(params.id);
  }
  // Returns bundles list w.r.t provided <variantIDs>
  @Post('bundles')
  findBundlesByVariantIds(@Body() body): Promise<object> {
    return this.appService.getBundlesByVariantIds(body?.variantIds);
  }
}
