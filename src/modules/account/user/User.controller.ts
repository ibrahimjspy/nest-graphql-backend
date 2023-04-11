import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { Auth0UserInputDTO, UserAuth0IdDTO } from './dto/user.dto';
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

  @Get('api/v1/user/detail/:userAuth0Id')
  async auth0UserDetail(
    @Res() res,
    @Param() param: UserAuth0IdDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getUserAuth0Detail(param.userAuth0Id),
    );
  }

  @Put('/api/v1/user/update')
  async updateUserInfo(
    @Res() res,
    @Body() userInput: Auth0UserInputDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.updateUserInfo(userInput, Authorization),
    );
  }
}
