import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RetailerService } from './Retailer.service';
import { RetailerEmailDto, RetailerRegisterDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('retailer')
@Controller('')
export class RetailerController {
  constructor(private readonly appService: RetailerService) {}

  @Get('api/v1/shop/job/title')
  async getRetailerJobTitle(): Promise<object> {
    return this.appService.getRetailerJobTitle();
  }

  @Post('api/v1/shop/email/availability')
  async getCheckRetailerEmail(@Body() body: RetailerEmailDto): Promise<object> {
    return this.appService.getCheckRetailerEmail(body?.email);
  }

  @Post('api/v1/shop/resale/certificate')
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

  @Post('api/v1/retailer/auth/sign-up')
  async retailerRegister(@Body() body: RetailerRegisterDto): Promise<object> {
    return this.appService.retailerRegister(body);
  }
}
