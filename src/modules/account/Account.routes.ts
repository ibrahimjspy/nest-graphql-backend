import { Routes } from '@nestjs/core';
import { AccountModule } from './Account.module';
import { AddressModule } from './address/Address.module';
import { UserModule } from './user/User.module';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    module: AccountModule,
    children: [
      {
        path: '',
        module: AddressModule,
      },
      {
        path: '',
        module: UserModule,
      },
    ],
  },
];
