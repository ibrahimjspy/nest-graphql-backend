import { Controller, Get, Headers, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/whoami')
  async User(@Res() res, @Headers() headers): Promise<object> {
    const Authorization_Token: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getUserinfo(Authorization_Token),
    );
  }
}
