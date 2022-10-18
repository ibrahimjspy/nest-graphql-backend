import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { AddressService } from './Address.service';

@ApiTags('account')
@Controller()
export class AddressController {
  constructor(private readonly appService: AddressService) {}

  @Get('/:userId')
  async addresses(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getAddresses(params?.userId),
    );
  }

  @Post('/:userId/create')
  async createAddress(
    @Res() res,
    @Param() params,
    @Body() body,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.createAddress(params?.userId, body),
    );
  }

  @Delete('/:addressId/delete')
  async deleteAddress(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteAddress(params?.addressId),
    );
  }

  @Put('/:addressId/default')
  async setDefaultAddress(
    @Res() res,
    @Param() params,
    @Body() body,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.setDefaultAddress(body?.userId, params?.addressId),
    );
  }

  @Put('/:addressId/update')
  async updateAddress(
    @Res() res,
    @Param() params,
    @Body() body,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateAddress(params?.addressId, body),
    );
  }
}
