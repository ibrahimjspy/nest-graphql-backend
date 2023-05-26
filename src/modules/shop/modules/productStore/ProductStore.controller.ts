import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ProductStoreService } from './ProductStore.service';
import { PushToStoreDto } from './dto/products';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('shop/productStore')
@Controller()
export class ProductStoreController {
  constructor(private readonly appService: ProductStoreService) {
    return;
  }

  @Post('api/v1/store/image/upload')
  @ApiOperation({
    summary: 'stores image against a store id',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'imports products to storefront' })
  public async pushToStore(
    @Res() res,
    @Body() body: PushToStoreDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.pushToStore(body, Authorization),
    );
  }
}
