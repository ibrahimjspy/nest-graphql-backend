import { Module } from '@nestjs/common';
import { MenuCategoriesController } from './menuCategories.controller';
import { MenuCategoriesService } from './menuCategories.service';

@Module({
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService],
  exports: [MenuCategoriesService],
})
export class MenuCategoriesModule {}
