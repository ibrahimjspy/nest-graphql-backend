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
import { UserIdDto, AddressIdDto, AddressDto } from './dto';

@ApiTags('account')
@Controller()
export class AddressController {
  constructor(private readonly appService: AddressService) {}

  @Get('/:userId')
  async addresses(@Res() res, @Param() userIdDto: UserIdDto): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getAddresses(userIdDto.userId),
    );
  }

  @Post('/:userId/create')
  async createAddress(
    @Res() res,
    @Param() userIdDto: UserIdDto,
    @Body() addressDto: AddressDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.createAddress(userIdDto.userId, addressDto),
    );
  }

  @Delete('/:addressId/delete')
  async deleteAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteAddress(addressIdDto.addressId),
    );
  }

  @Put('/:addressId/default')
  async setDefaultAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
    @Body() userIdDto: UserIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.setDefaultAddress(
        userIdDto.userId,
        addressIdDto.addressId,
      ),
    );
  }

  @Put('/:addressId/update')
  async updateAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
    @Body() addressDto: AddressDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateAddress(addressIdDto.addressId, addressDto),
    );
  }
}
