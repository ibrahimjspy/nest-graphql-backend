import { Module } from '@nestjs/common';
import { ImportController } from './Import.controller';
import { ImportService } from './Import.service';

@Module({
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
