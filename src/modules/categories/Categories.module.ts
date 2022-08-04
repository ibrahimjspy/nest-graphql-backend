import { Module } from '@nestjs/common';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
