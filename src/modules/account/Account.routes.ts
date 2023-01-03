import { Routes } from '@nestjs/core';
import { AccountModule } from './Account.module';
import { AddressModule } from './address/Address.module';
import { UserModule } from './user/user.mudule';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'account',
    module: AccountModule,
    children: [
      {
        path: 'address',
        module: AddressModule,
      },
      {
        path: 'user',
        module: UserModule,
      },
    ],
  },
];
