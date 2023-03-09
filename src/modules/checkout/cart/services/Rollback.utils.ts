import { CheckoutLinesInterface } from './saleor/Cart.saleor.types';

/**
 *  @description - this method compares saleor lines created and user bundle lines.
 *  it then return quantity that should br updated after rolling back user bundles which were added previously
 * @params saleorResponse: responseAfter checkout lines are created or added even thought user email has failed
 * @params userLines -- fetched from input bundles
 */
export const getUpdatedLinesRollback = (
  saleorResponse,
  userLines,
): CheckoutLinesInterface => {
  const updatedLines: any = [];
  saleorResponse?.lines?.map((checkoutLine) => {
    const matchingLine = userLines.find(
      (x) => x.variantId === checkoutLine?.variant?.id,
    );
    if (matchingLine) {
      updatedLines.push({
        variantId: matchingLine.variantId,
        quantity: checkoutLine.quantity - matchingLine.quantity,
      });
    }
  });
  return updatedLines;
};
