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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RetailerService } from './Retailer.service';
import { RetailerEmailDto, RetailerRegisterDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('shop/retailer')
@Controller('')
export class RetailerController {
  constructor(private readonly appService: RetailerService) {}

  @Get('api/v1/shop/job/title')
  @ApiOperation({
    summary: 'returns job title against a retailer',
  })
  async getRetailerJobTitle(): Promise<object> {
    return this.appService.getRetailerJobTitle();
  }

  @Post('api/v1/shop/email/availability')
  @ApiOperation({
    summary: 'this api validates retailer email',
  })
  async validateRetailerEmail(@Body() body: RetailerEmailDto): Promise<object> {
    return this.appService.getCheckRetailerEmail(body?.email);
  }

  @Post('api/v1/shop/resale/certificate')
  @ApiOperation({
    summary: 'uploads retailer certificate',
  })
  @UseInterceptors(FileInterceptor('permit_img1'))
  uploadRetailerCertificate(
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
  @ApiOperation({
    summary: 'this api registers a retailer',
  })
  async retailerRegister(@Body() body: RetailerRegisterDto): Promise<object> {
    return this.appService.retailerRegister(body);
  }
}
