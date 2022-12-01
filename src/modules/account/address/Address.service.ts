import { Injectable, Logger, Inject } from '@nestjs/common';
import { AddressInput } from 'src/graphql/mutations/account';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import * as AccountHandlers from 'src/graphql/handlers/account';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AddressService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly logger = new Logger(AddressService.name);
  private readonly authorizationToken = this.request.headers.authorization;

  public async getAddresses(userId: string): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.addressesByUserIdHandler(
          userId,
          this.authorizationToken,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createAddress(
    userId: string,
    address: AddressInput,
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.createAddressHandler(
          userId,
          address,
          this.authorizationToken,
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

  public async deleteAddress(addressId: string): Promise<SuccessResponseType> {
    try {
      await AccountHandlers.deleteAddressHandler(
        addressId,
        this.authorizationToken,
      );
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
        await AccountHandlers.setDefaultAddressHandler(
          userId,
          addressId,
          this.authorizationToken,
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
  ): Promise<SuccessResponseType> {
    try {
      return prepareSuccessResponse(
        await AccountHandlers.updateAddressHandler(
          addressId,
          address,
          this.authorizationToken,
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
}
