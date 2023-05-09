import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './Address.service';
import { AddressFixtures } from './Address.service.type';
import {
  FailedResponseType,
  SuccessResponseType,
} from 'src/core/utils/response.type';

import RecordNotFound from 'src/core/exceptions/recordNotFound';
import * as Mocks from 'src/graphql/mocks/address.mock';
import * as AccountHandlers from 'src/graphql/handlers/account';

describe('AddressService', () => {
  let service: AddressService;
  let fd: AddressFixtures;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService],
    }).compile();
    module.useLogger(false);

    service = module.get<AddressService>(AddressService);
    fd = {
      userId: Mocks.mockUserId(),
      addressId: Mocks.mockAddressId(),
      addresses: Mocks.mockAddresses(),
      addressInput: Mocks.mockAddressInput(),
    };
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get addresses', async () => {
    jest
      .spyOn(AccountHandlers, 'addressesByUserIdHandler')
      .mockImplementation(async () => fd.addresses);

    const expected: SuccessResponseType = {
      status: 200,
      data: fd.addresses,
    };
    const getAddress = await service.getAddresses(fd.userId, '');
    expect(getAddress).toEqual(expected);
    expect(getAddress).toBeDefined();
  });

  it('should not get addresses', async () => {
    jest
      .spyOn(AccountHandlers, 'addressesByUserIdHandler')
      .mockImplementation(async () => {
        throw new Error('API failed.');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Something went wrong.',
    };
    expect(await service.getAddresses(fd.userId, '')).toEqual(expected);
  });

  it('should create address', async () => {
    jest
      .spyOn(AccountHandlers, 'createAddressHandler')
      .mockImplementation(async () => fd.addresses[0]);

    const expected: SuccessResponseType = {
      status: 200,
      data: fd.addresses[0],
    };
    expect(await service.createAddress(fd.userId, fd.addressInput, '')).toEqual(
      expected,
    );
  });

  it('should not create address if API failed', async () => {
    jest
      .spyOn(AccountHandlers, 'createAddressHandler')
      .mockImplementation(async () => {
        throw new Error('API failed.');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Something went wrong.',
    };
    expect(await service.createAddress(fd.userId, fd.addressInput, '')).toEqual(
      expected,
    );
  });

  it('should not create address if user not found', async () => {
    jest
      .spyOn(AccountHandlers, 'createAddressHandler')
      .mockImplementation(async () => {
        throw new RecordNotFound('User');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'User not found',
    };
    expect(await service.createAddress(fd.userId, fd.addressInput, '')).toEqual(
      expected,
    );
  });

  it('should delete address', async () => {
    jest.spyOn(AccountHandlers, 'deleteAddressHandler').mockReturnValue(null);

    const expected: SuccessResponseType = {
      status: 200,
      message: 'Address is deleted successfully.',
    };
    expect(await service.deleteAddress(fd.addressId, '')).toEqual(expected);
  });

  it('should not delete address', async () => {
    jest
      .spyOn(AccountHandlers, 'deleteAddressHandler')
      .mockImplementation(async () => {
        throw new Error('API failed.');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Something went wrong.',
    };
    expect(await service.deleteAddress(fd.addressId, '')).toEqual(expected);
  });

  it('should set default address', async () => {
    jest
      .spyOn(AccountHandlers, 'setDefaultAddressHandler')
      .mockImplementation(async () => fd.addresses);

    const expected: SuccessResponseType = {
      status: 200,
      data: fd.addresses,
    };
    expect(
      await service.setDefaultAddress(fd.userId, fd.addressId, ''),
    ).toEqual(expected);
  });

  it('should not set default address if API failed', async () => {
    jest
      .spyOn(AccountHandlers, 'setDefaultAddressHandler')
      .mockImplementation(async () => {
        throw new Error('API failed.');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Something went wrong.',
    };
    expect(
      await service.setDefaultAddress(fd.userId, fd.addressId, ''),
    ).toEqual(expected);
  });

  it('should not set default address if address not found', async () => {
    jest
      .spyOn(AccountHandlers, 'setDefaultAddressHandler')
      .mockImplementation(async () => {
        throw new RecordNotFound('Address');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Address not found',
    };
    expect(
      await service.setDefaultAddress(fd.userId, fd.addressId, ''),
    ).toEqual(expected);
  });

  it('should update address', async () => {
    jest
      .spyOn(AccountHandlers, 'updateAddressHandler')
      .mockImplementation(async () => fd.addresses[0]);

    const expected: SuccessResponseType = {
      status: 200,
      data: fd.addresses[0],
    };
    expect(
      await service.updateAddress(fd.addressId, fd.addressInput, ''),
    ).toEqual(expected);
  });

  it('should update address if API failed', async () => {
    jest
      .spyOn(AccountHandlers, 'updateAddressHandler')
      .mockImplementation(async () => {
        throw new Error('API failed');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Something went wrong.',
    };
    expect(
      await service.updateAddress(fd.addressId, fd.addressInput, ''),
    ).toEqual(expected);
  });

  it('should update address if Address not found', async () => {
    jest
      .spyOn(AccountHandlers, 'updateAddressHandler')
      .mockImplementation(async () => {
        throw new RecordNotFound('Address');
      });

    const expected: FailedResponseType = {
      status: 400,
      message: 'Address not found',
    };
    expect(
      await service.updateAddress(fd.addressId, fd.addressInput, ''),
    ).toEqual(expected);
  });
});
