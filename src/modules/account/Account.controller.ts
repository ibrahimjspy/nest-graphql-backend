import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './Account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get('/address/:userId')
  async address(@Res() res, @Param() params): Promise<object> {
    // TODO: Convert Mock API to Real API
    return res
      .status(200)
      .json(await this.appService.getAddresses(params?.userId));
  }

  @Post('/address/:userId/create')
  async addressCreate(
    @Res() res,
    @Param() params,
    @Body() body,
  ): Promise<object> {
    // TODO: Convert Mock API to Real API
    return res
      .status(200)
      .json(await this.appService.addressCreate(params?.userId, body));
  }
}
