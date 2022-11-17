import { faker } from '@faker-js/faker';

export const mockOrderReporting = () => {
  return {
    readToFulfill: faker.datatype.number({ min: 3, max: 100 }),
    ordersToPickup: faker.datatype.number({ min: 3, max: 100 }),
    ordersReturned: faker.datatype.number({ min: 3, max: 100 }),
    totalOrders: faker.datatype.number({ min: 3, max: 100 }),
  };
};
