import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { ShopService } from '../../shop/Shop.service';
@Module({
  controllers: [UserController],
  providers: [UserService, ShopService],
})
export class UserModule {}
