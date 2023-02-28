import { Body, Controller, Get, Headers, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { UserInputDTO } from './dto/user.dto';
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/account/user/whoami')
  @ApiBearerAuth('JWT-auth')
  async User(
    @Res() res,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(res, await this.appService.getUserinfo(token));
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
