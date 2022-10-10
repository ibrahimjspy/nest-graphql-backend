import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './Categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}
  // Returns top menu categories
  @Get('/menu')
  findMenuCategories(): Promise<object> {
    return this.appService.getMenuCategories();
  }
  // Returns product card collections and relating categories for landing page
  @Get('/productSections')
  findProductCollections(): Promise<object> {
    return this.appService.getProductSections();
  }
}
