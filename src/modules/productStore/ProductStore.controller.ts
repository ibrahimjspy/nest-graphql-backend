import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ShopIdDto, shopInfoDto } from 'src/modules/orders/dto';
import { ProductStoreService } from './ProductStore.service';
import {
  PushToStoreDto,
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
  getStoredProductsDTO,
} from './dto/products';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('productStore')
@Controller()
export class ProductStoreController {
  constructor(private readonly appService: ProductStoreService) {
    return;
  }

  @Get('api/v1/stored/products/:shopId')
  public async findStoredProducts(
    @Res() res,
    @Query() filter: getStoredProductsDTO,
    @Param() shopDto: ShopIdDto,
  ): Promise<object> {
    const data = await this.appService.getStoredProducts(
      shopDto.shopId,
      filter,
    );
    return makeResponse(res, data);
  }

  @Post('api/v1/product/store')
  @ApiOperation({ summary: 'adds product to store' })
  public async addProductsToStore(
    @Res() res,
    @Body() body: addToProductStoreDTO,
  ) {
    return await makeResponse(
      res,
      await this.appService.addToProductStore(body),
    );
  }

  @Delete('api/v1/product/store')
  @ApiOperation({ summary: 'removes product from store' })
  public async deleteImportedProducts(
    @Res() res,
    @Body() body: deleteFromProductStoreDTO,
  ) {
    return await makeResponse(
      res,
      await this.appService.deleteFromProductStore(body),
    );
  }

  @Get('api/v1/store/info/:shopId')
  @ApiOperation({ summary: 'returns retailer store details' })
  public async getStoreInfo(
    @Res() res,
    @Param() param: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.getStoreInfo(param.shopId, Authorization),
    );
  }

  @Post('api/v1/store/info/:shopId')
  @ApiOperation({ summary: 'updates retailer store details' })
  public async updateStoreInfo(
    @Res() res,
    @Param() param: ShopIdDto,
    @Body() body: shopInfoDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.updateStoreInfo(param.shopId, body, Authorization),
    );
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
