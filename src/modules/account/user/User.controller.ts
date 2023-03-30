import {
  Body,
  Controller,
  Get,
  Headers,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { UserInputDTO } from './dto/user.dto';
import { b2cDto } from 'src/modules/shop/dto/shop';
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/account/user/whoami')
  @ApiBearerAuth('JWT-auth')
  async User(
    @Res() res,
    @Query() filter: b2cDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getUserinfo(token, filter.isB2c),
    );
  }

  @Put('/api/v1/user/update')
  async updateUserInfo(
    @Res() res,
    @Body() userInput: UserInputDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.updateUserInfo(userInput, Authorization),
    );
  }
}
