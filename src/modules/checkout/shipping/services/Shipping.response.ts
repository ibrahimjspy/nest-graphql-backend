/**
 * @description -- this method parses saleor checkout price object and returns it with format which fulfills our
 * requirements
 * @satisfies - we make sure that subtotal does not include any discount
 */
export const preparePromotionResponse = (promotionResponse) => {
  if (!promotionResponse.checkout.id) {
    return promotionResponse;
  }
  const subtotalPrice = promotionResponse.checkout.subtotalPrice.gross.amount;
  const discount = promotionResponse.checkout.discount.amount;

  promotionResponse.checkout.subtotalPrice.gross.amount =
    subtotalPrice + discount;
  promotionResponse.checkout.shippingPrice.gross.amount =
    promotionResponse.checkout.shippingPrice.gross.amount - discount;
  promotionResponse.checkout.discount.amount = 0;

  return promotionResponse;
};
