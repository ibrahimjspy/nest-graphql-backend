import { Address, AddressInput } from 'src/graphql/types/address.type';

export interface AccountFixtures {
  userId: string;
  addressId: string;
  addresses: Address[];
  addressInput: AddressInput;
}
