import { faker } from '@faker-js/faker';
import { CountryCode } from 'src/graphql/enums';
import { Address, AddressInput } from 'src/graphql/types/address.type';

export const mockUserId = (): string => faker.datatype.uuid();

export const mockAddressId = (): string => faker.datatype.uuid();

export const mockAddressInput = (): AddressInput => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName('male'),
    companyName: faker.company.name(),
    streetAddress1: faker.address.street(),
    streetAddress2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    cityArea: faker.datatype.string(),
    postalCode: faker.address.zipCode(),
    country: CountryCode.US,
    phone: faker.phone.number(),
  };
};

export const mockAddress = (): Address => {
  return {
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName('male'),
    companyName: faker.company.name(),
    streetAddress1: faker.address.street(),
    streetAddress2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    cityArea: faker.datatype.string(),
    postalCode: faker.address.zipCode(),
    country: {
      code: faker.address.countryCode(),
      country: faker.address.country(),
    },
    phone: faker.phone.number(),
    isDefaultShippingAddress: faker.datatype.boolean(),
  };
};

export const mockAddresses = (n: number = 2): Address[] => {
  let addresses: Address[] = [];
  for (let index = 0; index < n; index++) addresses.push(mockAddress());
  return addresses;
};
