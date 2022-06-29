import { Controller, Get } from '@nestjs/common';
import { MenuCategoriesService } from './menuCategories.service';

@Controller('menuCategories')
export class MenuCategoriesController {
  constructor(private readonly appService: MenuCategoriesService) {}
  @Get()
  findAll(): Promise<object> {
    return this.appService.getCategories();
  }
}
