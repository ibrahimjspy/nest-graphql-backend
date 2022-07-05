import { Controller, Get } from '@nestjs/common';
import { MenuCategoriesService } from './menuCategories.service';

@Controller('menuCategories')
export class MenuCategoriesController {
  constructor(private readonly appService: MenuCategoriesService) {}
  // Returns top menu categories
  @Get()
  findAll(): Promise<object> {
    return this.appService.getCategories();
  }
  // Returns product card collection categories
  @Get('/productCollections')
  findCollections(): Promise<object> {
    return this.appService.getCollections();
  }
}
