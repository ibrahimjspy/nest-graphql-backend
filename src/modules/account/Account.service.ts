import { Injectable, Logger } from '@nestjs/common';
import { AddressType } from 'src/graphql/handlers/account/address.type';
import { AddressCreateInputType } from 'src/graphql/mutations/account';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import * as AccountHandlers from 'src/graphql/handlers/account';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  private readonly addresses: AddressType[] = [
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

  public async getAddresses(userId: string): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.addressesByUserIdHandler(userId),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createAddress(
    userId: string,
    address: AddressCreateInputType,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.createAddressHandler(userId, address),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteAddress(addressId: string): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.deleteAddressHandler(addressId),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
