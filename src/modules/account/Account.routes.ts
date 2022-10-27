import { Routes } from '@nestjs/core';
import { AccountModule } from './Account.module';
import { AddressModule } from './address/Address.module';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'account',
    module: AccountModule,
    children: [
      {
        path: 'address',
        module: AddressModule,
      },
    ],
  },
];
