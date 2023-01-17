import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { ShopDto } from 'src/modules/shop/dto/shop';

const federationMutation = (shop: ShopDto) => {
    return gql`
    mutation{
      createMarketplaceShop(
        input: {
          name: "${shop["name"]}"
          url: "${shop["url"]}"
          email: "${shop["email"]}"
          user: "${shop["email"]}"
          description: "${shop["description"]}"
          about: "${shop["about"]}"
          madeIn: "${shop["madeIn"]}"
          minOrder: ${shop["minOrder"]}
          returnPolicy: "${shop["returnPolicy"]}"
          storePolicy: "${shop["storePolicy"]}"
          fields: [
            { name: "logo", values: ["${shop["logo"]}"]}
            { name: "banner", values: ["${shop["banner"]}"]}
            { name: "facebookUrl", values: ["${shop["facebookUrl"]}"]}
            { name: "pinterestUrl", values: ["${shop["pinterestUrl"]}"]}
            { name: "instagramUrl", values: ["${shop["instagramUrl"]}"]}
            { name: "twitterUrl", values: ["${shop["twitterUrl"]}"]}
          ]
        }
      )
      {
        name
        url
        description
        about
        fields{
          id
          name
          values
        }
      }
    }
  `;
};

export const createShopMutation = (
  shop: ShopDto
) => {
  return graphqlQueryCheck(
    federationMutation(shop),
    federationMutation(shop),
    "true"
  );
};