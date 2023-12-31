import { Injectable, Logger } from '@nestjs/common';
import { AddressInput } from 'src/graphql/mutations/account';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import * as AccountHandlers from 'src/graphql/handlers/account';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  public async getAddresses(
    userId: string,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.addressesByUserIdHandler(userId, token),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createAddress(
    userId: string,
    address: AddressInput,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.createAddressHandler(userId, address, token),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteAddress(
    addressId: string,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      await AccountHandlers.deleteAddressHandler(addressId, token);
      return prepareSuccessResponse(null, 'Address is deleted successfully.');
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setDefaultAddress(
    userId: string,
    addressId: string,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      this.logger.log(`Setting ${addressId} as default address`);
      return prepareSuccessResponse(
        await AccountHandlers.setDefaultAddressHandler(
          userId,
          addressId,
          token,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async updateAddress(
    addressId: string,
    address: AddressInput,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.updateAddressHandler(addressId, address, token),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }
}
