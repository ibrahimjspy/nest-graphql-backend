import { Injectable, Logger } from '@nestjs/common';
import { addressType } from 'src/graphql/handlers/account/address.type';
import { addressCreateInputType } from 'src/graphql/mutations/account';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  private readonly addresses: Array<addressType> = [
    {
      id: 'QWRkcmVzczoxNTc=',
      firstName: 'Abigail',
      lastName: 'Abraham',
      companyName: 'Sharove',
      streetAddress1: 'Kickstart Aiworks',
      streetAddress2: '',
      city: 'Kabul',
      postalCode: '3124',
      country: {
        code: 'AG',
        country: 'Antigua and Barbuda',
      },
      phone: '+923244150832',
      isDefaultShippingAddress: true,
    },
    {
      id: 'QDRkcmVsdzoxNTc=',
      firstName: 'Christopher',
      lastName: 'Baker',
      companyName: 'Sharove',
      streetAddress1: 'Kickstart Aiworks',
      streetAddress2: '',
      city: 'New York',
      postalCode: '3434',
      country: {
        code: 'US',
        country: 'United States',
      },
      phone: '+923244150832',
      isDefaultShippingAddress: false,
    },
  ];

  public async getAddresses(
    userId: string,
  ): Promise<{ data: Array<addressType> }> {
    return {
      data: this.addresses,
    };
  }

  public async addressCreate(
    userId: string,
    address: addressCreateInputType,
  ): Promise<{ data: Array<addressType> }> {
    return {
      data: [
        ...this.addresses,
        {
          id: 'Q2RkcmasdzoxNTc=',
          firstName: address.firstName,
          lastName: address.lastName,
          companyName: address.companyName,
          streetAddress1: address.streetAddress1,
          streetAddress2: address.streetAddress2,
          city: address.city,
          postalCode: address.postalCode,
          country: {
            code: address?.country?.toString(),
            country: address?.country?.toString(),
          },
          phone: address.phone,
          isDefaultShippingAddress: false,
        },
      ],
    };
  }
}