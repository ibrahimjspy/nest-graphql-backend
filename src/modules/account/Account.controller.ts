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
import { AccountService } from './Account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get('/address/:userId')
  async addresses(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getAddresses(params?.userId),
    );
  }

  @Post('/address/:userId/create')
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

  @Delete('/address/:addressId/delete')
  async deleteAddress(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteAddress(params?.addressId),
    );
  }

  @Put('/address/:addressId/default')
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
}
