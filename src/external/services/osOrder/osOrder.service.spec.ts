import { Test, TestingModule } from '@nestjs/testing';
import OsOrderService from './osOrder.service';
import { mockOsOrderBundles } from '../../../../test/mock/osOrder';
import { transformObjectToMap } from './osOrder.utils';

describe('osOrder Service', () => {
  let service: OsOrderService;
  const mocks = {
    orderNumber: 245,
    b2cProducts: [
      {
        id: 'UHJvZHVjdDoyMDQ1ODY=',
        color: 'GREEN',
        size: 'S',
        quantity: 6,
      },
      {
        id: 'UHJvZHVjdDoyMDQ1ODY=',
        color: 'GREEN',
        size: 'M',
        quantity: 3,
      },
      {
        id: 'UHJvZHVjdDoyMDQ1ODQ=',
        color: 'BLACK',
        size: 'S/M',
        quantity: 4,
      },
      {
        id: 'UHJvZHVjdDoyMDQ1ODU=',
        color: 'D.MAUVE FLORAL',
        size: 'S',
        quantity: 3,
      },
    ],
    osProductMapping: {
      'UHJvZHVjdDoxNzY3Mg==': '90190459',
      'UHJvZHVjdDoxNTc2NQ==': '90628152',
      'UHJvZHVjdDoxMzc1Mg==': '94391774',
    },
    b2bProductMapping: {
      'UHJvZHVjdDoyMDQ1ODQ=': 'UHJvZHVjdDoxNzY3Mg==',
      'UHJvZHVjdDoyMDQ1ODY=': 'UHJvZHVjdDoxMzc1Mg==',
      'UHJvZHVjdDoyMDQ1ODU=': 'UHJvZHVjdDoxNTc2NQ==',
    },
    OsShippingAddressId: 162202,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OsOrderService],
    }).compile();
    module.useLogger(false);

    service = module.get<OsOrderService>(OsOrderService);
  });

  it('should transform b2c products to os order payload', async () => {
    const transformOrderPayload = service.transformOrderPayload({
      orderNumber: mocks.orderNumber,
      osProductMapping: transformObjectToMap(mocks.osProductMapping),
      b2bProductMapping: transformObjectToMap(mocks.b2bProductMapping),
      b2cProducts: mocks.b2cProducts,
      OsShippingAddressId: mocks.OsShippingAddressId,
      osProductsBundles: mockOsOrderBundles,
    });

    expect(transformOrderPayload).toEqual({
      orders: [
        {
          item_id: '94391774',
          color_id: 'AFW_0119',
          pack_qty: 3,
          stock_type: 'in_stock',
          memo: '',
          sms_number: '234-9882',
          spa_id: 162202,
          spm_name: 'UPS',
          store_credit: '0',
          signature_requested: 'false',
        },
        {
          item_id: '90190459',
          color_id: '449_0108',
          pack_qty: 2,
          stock_type: 'in_stock',
          memo: '',
          sms_number: '234-9882',
          spa_id: 162202,
          spm_name: 'UPS',
          store_credit: '0',
          signature_requested: 'false',
        },
        {
          item_id: '90628152',
          color_id: '327_1033',
          pack_qty: 2,
          stock_type: 'in_stock',
          memo: '',
          sms_number: '234-9882',
          spa_id: 162202,
          spm_name: 'UPS',
          store_credit: '0',
          signature_requested: 'false',
        },
      ],
      sharove_order_id: 245,
      stripe_payment_method_id: 'pm_1NBliPHH1XVL0zjbClGzN1hX',
      spa_id: 162202,
      payment_type: 'credit_card',
      billing: {
        first_name: 'Azhar',
        last_name: 'Iqbal',
        address1: '9956B Foxrun St. Poughkeepsie, NY 12603',
        city: 'Poughkeepsie',
        state: 'NY',
        zipcode: '10001',
        country: 'US',
        phone_number: '(922) 322-8703',
        nick_name: 'Sharove',
        address2: '',
        company_name: 'Sharove',
      },
      order_type: 'D2C',
    });
    expect(transformOrderPayload).toBeDefined();
  });
});
