import { Module } from '@nestjs/common';
import { ImportListController } from './ImportList.controller';
import { ImportListService } from './ImportList.service';

@Module({
  controllers: [ImportListController],
  providers: [ImportListService],
  exports: [ImportListService],
})
export class ImportListModule {}
