import { gql } from 'graphql-request';
import { shopDetailsFragment } from 'src/graphql/fragments/shop';
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
          about: "${about || ''}"
          description: "${description}"
          url: "${url}"
          fields: ${JSON.stringify(fields)
            .replace(/"name"/g, 'name')
            .replace(/"newValues"/g, 'newValues')}
        }
      ) {
        ...Shop
      }
    }
    ${shopDetailsFragment}
  `;
};
