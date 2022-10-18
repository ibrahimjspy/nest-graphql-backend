import { Injectable, Logger } from '@nestjs/common';
import { AddressCreateInput } from 'src/graphql/mutations/account';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import * as AccountHandlers from 'src/graphql/handlers/account';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

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
    address: AddressCreateInput,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.createAddressHandler(userId, address),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteAddress(addressId: string): Promise<SuccessResponseType> {
    try {
      await AccountHandlers.deleteAddressHandler(addressId);
      return prepareSuccessResponse(null, 'Address is deleted successfully.');
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.setDefaultAddress(userId, addressId),
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
