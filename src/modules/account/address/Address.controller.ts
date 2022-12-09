import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { AddressService } from './Address.service';
import { AddressDto, AddressIdDto, UserIdDto } from './dto';

@ApiTags('account')
@Controller()
export class AddressController {
  constructor(private readonly appService: AddressService) {}

  @Get('/:userId')
  async addresses(
    @Res() res,
    @Param() userIdDto: UserIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getAddresses(userIdDto.userId, Authorization),
    );
  }

  @Post('/:userId')
  async createAddress(
    @Res() res,
    @Param() userIdDto: UserIdDto,
    @Body() addressDto: AddressDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.createAddress(
        userIdDto.userId,
        addressDto,
        Authorization,
      ),
    );
  }

  @Delete('/:addressId')
  async deleteAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.deleteAddress(
        addressIdDto.addressId,
        Authorization,
      ),
    );
  }

  @Put('/:addressId/default')
  async setDefaultAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
    @Body() userIdDto: UserIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.setDefaultAddress(
        userIdDto.userId,
        addressIdDto.addressId,
        Authorization,
      ),
    );
  }

  @Put('/:addressId')
  async updateAddress(
    @Res() res,
    @Param() addressIdDto: AddressIdDto,
    @Body() addressDto: AddressDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.updateAddress(
        addressIdDto.addressId,
        addressDto,
        Authorization,
      ),
    );
  }
}
