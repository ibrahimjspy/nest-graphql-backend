import { getUpdatedLinesRollback } from './Rollback.utils';

describe('Cart Rollbacks utility test', () => {
  const newLines = [
    { quantity: 4, variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDQ=' },
    { quantity: 4, variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDM=' },
    { quantity: 4, variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDI=' },
  ];
  const saleorResponse = {
    id: 'Q2hlY2tvdXQ6Y2EyNDI5OWEtNThiMy00NTNlLWE5MTEtN2I5NzAzNGI5ODk5',
    lines: [
      {
        quantity: 4,
        id: 'Q2hlY2tvdXRMaW5lOmUzNjI3OTFmLTRjODYtNGI2YS05YzA3LTA5ZTRkM2JkYTlkNg==',
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDQ=' },
      },
      {
        quantity: 4,
        id: 'Q2hlY2tvdXRMaW5lOjEyZjFmOTFjLTRmOTEtNDdmZC1iZWQwLWQzYThiMDcxZjQyYw==',
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDM=' },
      },
      {
        quantity: 4,
        id: 'Q2hlY2tvdXRMaW5lOmZjMDM2YTBhLTZkNzktNDI4NS04YTFhLWE2MDI4MjU0N2U2NA==',
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDI=' },
      },
    ],
  };
  describe('add to cart rollback util unit tests', () => {
    it('testing whether new updated lines are getting parsed correctly for add to cart rollbacks', async () => {
      const updatedLines = getUpdatedLinesRollback(saleorResponse, newLines);

      expect(updatedLines).toBeDefined();
      expect(updatedLines).toStrictEqual([
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDQ=', quantity: 0 },
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDM=', quantity: 0 },
        { variantId: 'UHJvZHVjdFZhcmlhbnQ6OTcyNDI=', quantity: 0 },
      ]);
    });
  });
});
