import { CheckoutService } from './Checkout.service';

export async function b2bClientintent(userEmail, token) {
  const intent = new CheckoutService();

  const ClientMapping = {
    'sharove@sharove.com': 'sharove@sharove.com',
  };
  /* Checking if the userEmail is in the ClientMapping object. If it is, it will return the
 createCheckoutSharovePlatformService function. If it is not, it will return the
 CreateCheckoutendConsumerService function. */
  if (userEmail === ClientMapping[userEmail]) {
    return await intent.createCheckoutSharovePlatformService(userEmail, token);
  } else {
    return await intent.CreateCheckoutendConsumerService(userEmail, token);
  }
}
