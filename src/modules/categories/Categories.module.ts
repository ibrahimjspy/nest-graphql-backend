import { Module } from '@nestjs/common';
import { MenuCategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

@Module({
  controllers: [MenuCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class MenuCategoriesModule {}
