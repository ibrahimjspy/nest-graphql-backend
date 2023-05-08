import {
  getAddBundleToCartLines,
  getBundleIds,
  getBundlesFromCheckout,
  getDeleteBundlesLines,
  getLinesFromBundles,
  getNewBundlesToAdd,
  getSelectedCheckoutBundles,
  getTargetBundleByBundleId,
  getTargetBundleByCheckoutBundleId,
  getUnSelectedCheckoutBundles,
  getUpdateCartBundleLines,
  getVariantIds,
  validateBundlesLength,
} from './Cart.utils';

describe('Cart utility tests', () => {
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
  });
});
