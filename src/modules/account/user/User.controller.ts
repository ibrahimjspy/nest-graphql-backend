import { Controller, Get, Res, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
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

  @Get('/api/v1/user/account/link/:accountId')
  async getAccountLinkFromStripe(@Res() res, @Param() param): Promise<object> {
    return await makeResponse(
      res,
      await this.appService.getAccountLinkFromStripe(param.accountId),
    );
  }
}
