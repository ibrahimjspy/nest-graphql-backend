import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { ShopService } from '../../shop/services/shop/Shop.service';
import Auth0Service from './services/auth0.service';
import SaleorAuthService from './services/saleorAuth.service';
import OSUserService from '../../../external/services/osUser.service';
@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ShopService,
    Auth0Service,
    SaleorAuthService,
    OSUserService,
  ],
})
export class UserModule {}
