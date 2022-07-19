import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './Categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}
  // Returns top menu categories
  @Get('/menu')
  findMenuCategories(): Promise<object> {
    return this.appService.getMenuCategories();
  }
  // Returns product card collections and relating categories
  @Get('/productCollections')
  findProductCollections(): Promise<object> {
    return this.appService.getProductCollections();
  }
}
