import { Test, TestingModule } from '@nestjs/testing';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import { ProductService } from './Product.service';

describe('Product Service', () => {
  let service: ProductService;
  let mocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();
    module.useLogger(false);

    service = module.get<ProductService>(ProductService);
    mocks = {
      productsGet: {
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: 'WyIwMDEiXQ==',
          startCursor: 'WyIwMDEiXQ==',
        },
        totalCount: 10072,
        edges: [
          {
            node: {
              id: 'UHJvZHVjdDoxMjUxNQ==',
              description:
                '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
              name: '001',
              slug: '001',
              defaultVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
                pricing: {
                  price: {
                    gross: { currency: 'USD', amount: 4 },
                    net: { currency: 'USD', amount: 4 },
                  },
                },
              },
              variants: [
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'WHITE' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'PINK' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'GREY' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLUE' }],
                    },
                    {
                      attribute: { name: 'Commission' },
                      values: [{ name: '10' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: 'ONE SIZE' }],
                    },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '3.5' }],
                    },
                    { attribute: { name: 'sku' }, values: [] },
                    {
                      attribute: { name: 'Resale Price' },
                      values: [{ name: '5.6' }],
                    },
                  ],
                },
              ],
              thumbnail: {
                url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
              },
            },
          },
        ],
      },
      expectedProducts: {
        totalCount: 10072,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: 'WyIwMDEiXQ==',
          startCursor: 'WyIwMDEiXQ==',
        },
        data: [
          {
            id: 'UHJvZHVjdDoxMjUxNQ==',
            description:
              '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "FACE MASK AB RHINESTONES Size : One Size 90% Polyester, 10% Spandex, Comfortable 3D Fitment, Reuseable, Washable Neonprene (Irritation Free), AB Stones, No returns, Not Recommended for children under 3, Non-medical mask "}, "type": "paragraph"}], "version": "2.24.3"}',
            name: '001',
            slug: '001',
            variants: [
              {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BLACK' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'ONE SIZE' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '3.5' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '5.6' }],
                  },
                ],
              },
              {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI3',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'WHITE' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'ONE SIZE' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '3.5' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '5.6' }],
                  },
                ],
              },
              {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI4',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'PINK' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'ONE SIZE' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '3.5' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '5.6' }],
                  },
                ],
              },
              {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'GREY' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'ONE SIZE' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '3.5' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '5.6' }],
                  },
                ],
              },
              {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTMw',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BLUE' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'ONE SIZE' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '3.5' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '5.6' }],
                  },
                ],
              },
            ],
            thumbnail: {
              url: 'http://localhost:8000/media/202007/V/94810af2-c621-11ea-89ed-002590aaee66_V.JPG',
            },
            defaultVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 4 },
                  net: { currency: 'USD', amount: 4 },
                },
              },
            },
          },
        ],
      },
    };
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get all products', async () => {
    jest
      .spyOn(ProductsHandlers, 'productsHandler')
      .mockImplementation(async () => mocks.productsGet);

    const getProducts = await service.getProducts({ first: 10 });
    expect(getProducts).toEqual(mocks.expectedProducts);
    expect(getProducts).toBeDefined();
  });
});
