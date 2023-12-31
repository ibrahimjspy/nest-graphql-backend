import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { UserService } from './User.service';
import { IsAuthenticated } from 'src/core/utils/decorators';
import {
  AllUsersDTO,
  Auth0UserInputDTO,
  ChangeUserPasswordDTO,
  UserAuth0IdDTO,
} from './dto/user.dto';
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

  @ApiOperation({
    summary: 'Get authenticated user details',
  })
  @Get('api/v2/user/whoami')
  @ApiBearerAuth('JWT-auth')
  async getUserV2(
    @Res() res,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(res, await this.appService.getUserinfoV2(token));
  }

  @ApiOperation({
    summary: 'Update authenticated user details',
  })
  @Put('/api/v1/user/update')
  @ApiBearerAuth('JWT-auth')
  async updateUserInfo(
    @Res() res,
    @Body() userInput: Auth0UserInputDTO,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateUserInfo(userInput, token),
    );
  }

  @ApiOperation({
    summary:
      'Change authenticated user password for auth0 and orangeshine and need to deprecated in future',
  })
  @Post('/api/v1/user/change/password')
  @ApiBearerAuth('JWT-auth')
  async changeUserPassword(
    @Res() res,
    @Body() userInput: ChangeUserPasswordDTO,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.changeUserPassword(userInput, token),
    );
  }

  @ApiOperation({
    summary: 'Send verification email for user',
  })
  @Post('/api/v1/user/send/verification/email')
  async sendVerificationEmail(
    @Res() res,
    @Body() userInput: UserAuth0IdDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.sendVerificationEmail(userInput),
    );
  }

  @ApiOperation({
    summary: 'Deactive user by auth0 user id',
  })
  @Post('/api/v1/user/deactivate')
  async deacticateUser(
    @Res() res,
    @Body() userInput: UserAuth0IdDTO,
  ): Promise<object> {
    return makeResponse(res, await this.appService.deactivateUser(userInput));
  }

  @ApiOperation({
    summary: 'Active user by auth0 user id',
  })
  @Post('/api/v1/user/activate')
  async activateUser(
    @Res() res,
    @Body() userInput: UserAuth0IdDTO,
  ): Promise<object> {
    return makeResponse(res, await this.appService.activateUser(userInput));
  }

  @ApiOperation({
    summary: 'Get all users from auth0 by auth0 connection with pagination',
  })
  @Get('/api/v1/users')
  async getUsers(@Res() res, @Query() userInput: AllUsersDTO): Promise<object> {
    return makeResponse(res, await this.appService.getUsers(userInput));
  }
}
