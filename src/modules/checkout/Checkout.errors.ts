export class NoPaymentIntentError extends Error {
  constructor(checkoutId: string) {
    super('no payment intent exists against ' + checkoutId);
    this.name = 'NoPaymentIntentError';
  }
}

export class EmptyCartError extends Error {
  userEmail: string;
  constructor(userEmail) {
    super('no bundles or variants exist in cart against' + userEmail);
    this.name = 'EmptyCartError';
    this.userEmail = userEmail;
  }
}

export class PaymentIntentCreationError extends Error {
  userEmail: string;
  paymentMethodId: string;
  constructor(userEmail, paymentMethodId) {
    super('payment intent creation failed against ' + userEmail);
    this.name = 'PaymentIntentCreationError';
    this.userEmail = userEmail;
    this.paymentMethodId = paymentMethodId;
  }
}

export class CheckoutIdError extends Error {
  userEmail: string;
  constructor(userEmail) {
    super('no checkout Id exists against ' + userEmail);
    this.name = 'CheckoutIdError';
    this.userEmail = userEmail;
  }
}
