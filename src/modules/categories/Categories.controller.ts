import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './Categories.service';

@Controller('categories')
export class MenuCategoriesController {
  constructor(private readonly appService: CategoriesService) {}
  // Returns top menu categories
  @Get('/menu')
  findAll(): Promise<object> {
    return this.appService.getCategories();
  }
  // Returns product card collections and relating categories
  @Get('/productCollections')
  findCollections(): Promise<object> {
    return this.appService.getCollections();
  }
}
