import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ProductStoreService } from './ProductStore.service';
import { PushToStoreDto } from './dto/products';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('productStore')
@Controller()
export class ProductStoreController {
  constructor(private readonly appService: ProductStoreService) {
    return;
  }

  @Post('api/v1/store/image/upload')
  @UseInterceptors(FileInterceptor('store_img'))
  getUploadRetailerCertificate(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|jfif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 2097152,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.uploadImages(file);
  }

  @Post('api/v1/store/push')
  @ApiOperation({ summary: 'imports products to storefront' })
  public async pushToStore(
    @Res() res,
    @Body() body: PushToStoreDto,
  ): Promise<object> {
    const { importList } = body;
    if (importList) {
      await this.appService.addBulkProductsToStore(body);
    }
    return await makeResponse(res, await this.appService.pushToStore(body));
  }
}
