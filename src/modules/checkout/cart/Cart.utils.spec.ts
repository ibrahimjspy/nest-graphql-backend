import {
  getAddBundleToCartLines,
  getBundleIds,
  getBundlesFromCheckout,
  getDeleteBundlesLines,
  getLinesFromBundles,
  getTargetBundleByBundleId,
  getTargetBundleByCheckoutBundleId,
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
      console.log(bundleIds);
      expect(bundleIds).toBeDefined();
      expect(bundleIds).toStrictEqual(['test']);
    });

    it('testing whether bundles are getting parsed from checkout bundles list', async () => {
      const checkoutBundleList: any = [{ bundle: { id: 'test' }, quantity: 3 }];
      const bundles = getBundlesFromCheckout(checkoutBundleList);
      console.log(bundles);
      expect(bundles).toBeDefined();
      expect(bundles).toStrictEqual([{ bundleId: 'test', quantity: 3 }]);
    });

    it('testing whether bundles length is correctly validated', async () => {
      const checkoutBundleList: any = [{ bundle: { id: 'test' }, quantity: 3 }];
      const validateBundleLength = validateBundlesLength(checkoutBundleList);
      console.log(validateBundleLength);
      expect(validateBundleLength).toBeDefined();
      expect(validateBundleLength).toStrictEqual(true);
    });

    it('testing whether update checkout bundle lines are correctly parsed', async () => {
      const updateBundleLines = getUpdateCartBundleLines(
        checkoutBundleList,
        targetBundles,
      );
      console.log(updateBundleLines);
      expect(updateBundleLines).toBeDefined();
      expect(updateBundleLines).toStrictEqual([
        { quantity: 20, variantId: 'test' },
      ]);
    });

    it('testing whether target bundles are correctly parsed and bundle is parsed correctly', async () => {
      const targetBundle = getTargetBundleByBundleId(
        checkoutBundleList,
        'test',
      );
      expect(targetBundle).toBeDefined();
      expect(targetBundle).toStrictEqual([
        {
          checkoutBundleId: 'test',
          bundle: { id: 'test', productVariants: [Array] },
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
      console.log(bundleLines);
      expect(bundleLines).toBeDefined();
      expect(bundleLines).toStrictEqual([{ quantity: 6, variantId: 'test' }]);
    });

    it('testing whether target checkout bundles are correctly getting targeted', async () => {
      const targetCheckoutBundles = getTargetBundleByCheckoutBundleId(
        checkoutBundleList,
        ['test'],
      );
      console.log(targetCheckoutBundles);
      expect(targetCheckoutBundles).toBeDefined();
      expect(targetCheckoutBundles).toStrictEqual(checkoutBundleList);
    });

    it('testing whether delete bundles lines are correctly getting parsed', async () => {
      const deleteBundleLines = getDeleteBundlesLines(
        lines,
        checkoutBundleList,
      );
      console.log(deleteBundleLines);
      expect(deleteBundleLines).toBeDefined();
      expect(deleteBundleLines).toStrictEqual([
        { lineId: 'test', quantity: 1 },
      ]);
    });

    it('testing whether bundle lines are correctly getting from add bundle lines', async () => {
      const addBundleLines = getAddBundleToCartLines(
        bundlesList,
        targetBundles,
      );
      console.log(addBundleLines);
      expect(addBundleLines).toBeDefined();
      expect(addBundleLines).toStrictEqual([
        { quantity: 20, variantId: 'test' },
      ]);
    });
  });
});
