import { gql } from 'graphql-request';
import { shopInfoDto } from 'src/modules/orders/dto';

export const updateStoreInfoMutation = (
  shopId: string,
  productDetails: shopInfoDto,
) => {
  const { name, url, about, fields, description } = productDetails;
  return gql`
    mutation {
      updateMarketplaceShop(
        id: "${shopId}"
        input: {
          name: "${name}"
          about: "${about}"
          description: "${description}"
          url: "${url}"
          fields: ${JSON.stringify(fields)
            .replace(/"name"/g, 'name')
            .replace(/"newValue"/g, 'newValue')}
        }
      ) {
        name
        about
        description
        url
        id
        fields {
          id
          name
          value
        }
      }
    }
  `;
};
