import { Routes } from '@nestjs/core';
import { ACCOUNT_ROUTES } from './modules/account/Account.routes';

export const APP_ROUTES: Routes = [
  ...ACCOUNT_ROUTES,
  // Other routes
];
