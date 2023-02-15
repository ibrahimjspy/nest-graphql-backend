import { Body, Controller, Get, Headers, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { UserInputDTO } from './dto/user.dto';
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/whoami')
  async User(
    @Res() res,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(res, await this.appService.getUserinfo(token));
  }

  @Put('/update')
  async updateUserInfo(
    @Res() res,
    @Body() userInput: UserInputDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.updateUserInfo(
        userInput,
        Authorization,
      ),
    );
  }
}
