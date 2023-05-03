import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { AddressService } from './Address.service';
import { AddressDto, AddressIdDto, UserIdDto } from './dto';

@ApiTags('account')
@Controller()
export class AddressController {
  constructor(private readonly appService: AddressService) {}
  @Get('api/v1/user/address/:userId')
  @ApiOperation({
    summary: 'returns user addresses against his id',
  })
  @ApiBearerAuth('JWT-auth')
  async getUserAddresses(
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

  @Post('api/v1/user/address/:addressId')
  @ApiOperation({
    summary: 'creates a new address address against a user id in saleor',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Delete('api/v1/user/address/:addressId')
  @ApiOperation({
    summary: 'deletes user address against address id',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Put('api/v1/user/address/default/:addressId')
  @ApiOperation({
    summary: 'sets address as default for a user',
  })
  @ApiBearerAuth('JWT-auth')
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

  @Put('api/v1/user/address/:userId')
  @ApiOperation({
    summary: 'updates an existing address against address id ',
  })
  @ApiBearerAuth('JWT-auth')
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
