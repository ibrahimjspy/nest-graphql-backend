import { Routes } from '@nestjs/core';
import { RetailerModule } from './Retailer.module';
import { PaymentsModule } from './payments/Payments.module';

export const RETAILER_ROUTES: Routes = [
  {
    path: 'retailer',
    module: RetailerModule,
    children: [
      {
        path: 'payments',
        module: PaymentsModule,
      },
    ],
  },
];
