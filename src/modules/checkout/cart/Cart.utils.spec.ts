import {
  getAddBundleToCartLines,
  getBundleIds,
  getBundlesFromCheckout,
  getDeleteBundlesLines,
  getLinesFromBundles,
  getNewBundlesToAdd,
  getOpenPackLinesReplace,
  getOpenPackLinesUpdate,
  getOpenPackTransactionType,
  getSelectedCheckoutBundles,
  getTargetBundleByBundleId,
  getTargetBundleByCheckoutBundleId,
  getUnSelectedCheckoutBundles,
  getUpdateCartBundleLines,
  getVariantIds,
  validateBundlesLength,
} from './Cart.utils';

describe('Cart utility tests', () => {
  const openPackUpdateMocks = {
    openPackVariants: [
      {
        oldVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
        quantity: 3,
      },
    ],
    bundle: {
      status: 200,
      data: {
        id: '62129625-7675-428a-a3ef-db82a7e72262',
        name: 'string',
        description: 'string',
        slug: 'string',
        productVariants: [
          {
            quantity: 5,
            productVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
              sku: '001-GRE-O-16796618463',
            },
          },
        ],
      },
    },
    saleor: {
      id: 'Q2hlY2tvdXQ6NjM4NzRkNjEtMTBlZC00N2E2LThlMzItMzlkMjNkOWI0NzJh',
      metadata: [],
      totalPrice: { gross: { amount: 80 } },
      shippingMethods: [],
      deliveryMethod: null,
      lines: [
        {
          id: 'Q2hlY2tvdXRMaW5lOjI5NmU2N2IyLTkxNTItNDY3Yy1hOTUzLTQ4NzY1NjgyODI5MQ==',
          quantity: 15,
          variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2' },
        },
        {
          id: 'Q2hlY2tvdXRMaW5lOmY4NGU0ZTg5LWVlMWQtNDljYS04NGEyLWQ0YzI3Zjg1ZmJmNA==',
          quantity: 5,
          variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5' },
        },
      ],
    },
  };
  const openPackReplaceMocks = {
    openPackUpdates: {
      checkoutId:
        'Q2hlY2tvdXQ6NjM4NzRkNjEtMTBlZC00N2E2LThlMzItMzlkMjNkOWI0NzJh',
      bundleId: '62129625-7675-428a-a3ef-db82a7e72262',
      variants: [
        {
          oldVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
          newVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
        },
      ],
    },
    bundle: {
      status: 200,
      data: {
        id: '62129625-7675-428a-a3ef-db82a7e72262',
        name: 'string',
        description: 'string',
        slug: 'string',
        productVariants: [
          {
            quantity: 5,
            productVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2',
              sku: '001-BLA-O-16796618460',
            },
          },
        ],
      },
    },
    saleor: {
      id: 'Q2hlY2tvdXQ6NjM4NzRkNjEtMTBlZC00N2E2LThlMzItMzlkMjNkOWI0NzJh',
      metadata: [],
      totalPrice: { gross: { amount: 80 } },
      shippingMethods: [],
      deliveryMethod: null,
      lines: [
        {
          id: 'Q2hlY2tvdXRMaW5lOjI5NmU2N2IyLTkxNTItNDY3Yy1hOTUzLTQ4NzY1NjgyODI5MQ==',
          quantity: 20,
          variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2' },
        },
      ],
    },
  };
  const bundlesList = {
    edges: [
      {
        node: {
          id: 'test',
          productVariants: [{ productVariant: { id: 'test' }, quantity: 2 }],
        },
      },
    ],
  };
  const lines = [
    {
      lineId: 'test',
      quantity: 3,
      variant: {
        id: 'test',
      },
    },
  ];
  const checkoutBundleList: any = [
    {
      checkoutBundleId: 'test',
      isSelected: false,
      bundle: {
        id: 'test',
        productVariants: [{ productVariant: { id: 'test' }, quantity: 2 }],
      },
      quantity: 3,
    },
  ];
  const targetBundles: any = [
    {
      bundleId: 'test',
      checkoutBundleId: 'test',
      quantity: 10,
    },
  ];
  describe('add to cart unit tests', () => {
    it('testing whether bundle ids are getting parsed from bundles list', async () => {
      const bundleList: any = [{ bundleId: 'test' }];
      const bundleIds = getBundleIds(bundleList);
      expect(bundleIds).toBeDefined();
      expect(bundleIds).toStrictEqual(['test']);
    });

    it('testing whether bundles are getting parsed from checkout bundles list', async () => {
      const checkoutBundleList: any = [{ bundle: { id: 'test' }, quantity: 3 }];
      const bundles = getBundlesFromCheckout(checkoutBundleList);
      expect(bundles).toBeDefined();
      expect(bundles).toStrictEqual([{ bundleId: 'test', quantity: 3 }]);
    });

    it('testing whether bundles length is correctly validated', async () => {
      const checkoutBundleList: any = [{ bundle: { id: 'test' }, quantity: 3 }];
      const validateBundleLength = validateBundlesLength(checkoutBundleList);
      expect(validateBundleLength).toBeDefined();
      expect(validateBundleLength).toStrictEqual(true);
    });

    it('testing whether update checkout bundle lines are correctly parsed', async () => {
      const updateBundleLines = getUpdateCartBundleLines(
        checkoutBundleList,
        targetBundles,
      );
      expect(updateBundleLines).toBeDefined();
      expect(updateBundleLines).toStrictEqual([
        { quantity: 20, variantId: 'test' },
      ]);
    });

    it('testing whether target bundles are correctly parsed and bundle is parsed correctly', async () => {
      const targetBundle = getTargetBundleByBundleId(checkoutBundleList, [
        {
          bundleId: 'test',
        },
      ]);
      expect(targetBundle).toBeDefined();
      expect(targetBundle).toStrictEqual([
        {
          checkoutBundleId: 'test',
          isSelected: false,
          bundle: {
            id: 'test',
            productVariants: [{ productVariant: { id: 'test' }, quantity: 2 }],
          },
          quantity: 3,
        },
      ]);
    });

    it('testing whether variant ids are correctly parsed from checkout bundles', async () => {
      const variantIds = getVariantIds(checkoutBundleList);
      expect(variantIds).toBeDefined();
      expect(variantIds).toStrictEqual(['test']);
    });

    it('testing whether bundle lines are correctly getting parsed from checkout bundles', async () => {
      const bundleLines = getLinesFromBundles(checkoutBundleList);
      expect(bundleLines).toBeDefined();
      expect(bundleLines).toStrictEqual([{ quantity: 6, variantId: 'test' }]);
    });

    it('testing whether target checkout bundles are correctly getting targeted', async () => {
      const targetCheckoutBundles = getTargetBundleByCheckoutBundleId(
        checkoutBundleList,
        ['test'],
      );
      expect(targetCheckoutBundles).toBeDefined();
      expect(targetCheckoutBundles).toStrictEqual(checkoutBundleList);
    });

    it('testing whether delete bundles lines are correctly getting parsed', async () => {
      const deleteBundleLines = getDeleteBundlesLines(
        lines,
        checkoutBundleList,
      );
      expect(deleteBundleLines).toBeDefined();
      expect(deleteBundleLines).toStrictEqual([
        { lineId: 'test', quantity: -3 },
      ]);
    });

    it('testing whether bundle lines are correctly getting from add bundle lines', async () => {
      const addBundleLines = getAddBundleToCartLines(
        bundlesList,
        targetBundles,
      );
      expect(addBundleLines).toBeDefined();
      expect(addBundleLines).toStrictEqual([
        { quantity: 20, variantId: 'test' },
      ]);
    });

    it('testing whether new bundles object are correctly created', async () => {
      const newBundles = getNewBundlesToAdd(checkoutBundleList, 'bundleId');
      expect(newBundles).toBeDefined();
      expect(newBundles).toStrictEqual([{ bundleId: 'bundleId', quantity: 3 }]);
    });

    it('testing whether selected bundles are getting parsed from all checkout bundles', async () => {
      const selectedBundles = getSelectedCheckoutBundles(checkoutBundleList);
      expect(selectedBundles).toBeDefined();
      expect(selectedBundles).toStrictEqual([]);
    });

    it('testing whether un selected bundles are getting parsed from all checkout bundles', async () => {
      const unSelectedBundles =
        getUnSelectedCheckoutBundles(checkoutBundleList);
      expect(unSelectedBundles).toBeDefined();
      expect(unSelectedBundles).toStrictEqual([
        {
          checkoutBundleId: 'test',
          isSelected: false,
          bundle: {
            id: 'test',
            productVariants: [{ productVariant: { id: 'test' }, quantity: 2 }],
          },
          quantity: 3,
        },
      ]);
    });
    it('testing whether open transaction type is correctly getting returned', async () => {
      const transactionStatus = getOpenPackTransactionType({
        variants: [{ quantity: 10, oldVariantId: 'test' }],
      } as any);
      expect(transactionStatus).toBeDefined();
      expect(transactionStatus).toStrictEqual('UPDATE');
    });

    it('testing whether getOpenPackLinesUpdate is working correctly', async () => {
      const updatedLines = getOpenPackLinesUpdate(
        openPackUpdateMocks.openPackVariants,
        openPackUpdateMocks.bundle,
        openPackUpdateMocks.saleor as any,
      );
      expect(updatedLines).toBeDefined();
      expect(updatedLines).toStrictEqual([
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5', quantity: 3 },
      ]);
    });

    it('testing whether getOpenPackLinesReplace is working correctly', async () => {
      const replacedLines = getOpenPackLinesReplace(
        openPackReplaceMocks.openPackUpdates,
        openPackReplaceMocks.bundle,
        openPackReplaceMocks.saleor as any,
      );
      expect(replacedLines).toBeDefined();
      expect(replacedLines).toStrictEqual([
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5', quantity: 5 },
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2', quantity: 15 },
      ]);
    });
  });
});
