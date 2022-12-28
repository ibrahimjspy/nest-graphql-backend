import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RetailerService } from './Retailer.service';
import { makeResponse } from '../../core/utils/response';
import { RetailerDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('retailer')
@Controller('retailer')
export class RetailerController {
  constructor(private readonly appService: RetailerService) {}

  @Get('orders/recent/:email')
  async getRecentOrdersData(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getRecentOrdersData(params?.email),
    );
  }

  @Get('job/title')
  async getRetailerJobTitle(): Promise<object> {
    return this.appService.getRetailerJobTitle();
  }

  @Post('email-availability')
  async getCheckRetailerEmail(@Body() body: RetailerDto): Promise<object> {
    return this.appService.getCheckRetailerEmail(body?.email);
  }

  @Post('resale-certificate')
  @UseInterceptors(FileInterceptor('permit_img1'))
  getUploadRetailerCertificate(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|pdf)$/,
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
    return this.appService.getUploadRetailerCertificate(file);
  }
}
