import MailchimpTransactional from '@mailchimp/mailchimp_transactional';
import { Logger } from '@nestjs/common';
import { MANDRILL_APP_TOKEN, SHAROVE_EMAIL_ADDRESS } from 'src/constants';
interface OrderConfirmationInterface {
  name: string;
  email: string;
  id: string;
}
/**
 * Sends an order confirmation email to the user.
 * @param orderInput - The order confirmation information.
 */
export const sendOrderConfirmationEmail = async (
  orderInput: OrderConfirmationInterface,
): Promise<void> => {
  const logger = new Logger('OrderConfirmationEmail');
  logger.log('Sending order confirmation email', orderInput.id);
  const mailchimpClient = new MailchimpTransactional(MANDRILL_APP_TOKEN);

  const emailContent = {
    subject: 'Order confirmation email',
    from_email: SHAROVE_EMAIL_ADDRESS,
    from_name: 'Sharove',
    to: [
      {
        email: orderInput.email,
        name: orderInput.name,
      },
    ],
    html: '<p>This is the HTML content of the email.</p>',
    text: `Your order has been placed ${orderInput.id}`,
  };

  logger.log('Email Preview (HTML):', emailContent.html);
  logger.log('Email Preview (Text):', emailContent.text);

  try {
    const response = await mailchimpClient.messages.send({
      message: emailContent,
    });
    logger.log('Email sent successfully:', response);
  } catch (error) {
    logger.error('Error sending email:', error);
  }
};
