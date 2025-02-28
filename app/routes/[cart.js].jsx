import {json} from '@shopify/remix-oxygen';
import {ShopifyCartClient} from 'aov-shopify-headless-cart-test';

export const loader = async ({request, context}) => {
  const {env, cart} = context;
  const cartData = await cart.get();

  const cartClient = new ShopifyCartClient({
    config: {
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      accessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      cartId: cartData?.id,
    },
  });

  try {
    const cart = await cartClient.getCart();
    return json({
      ...cart,
    });
  } catch (error) {
    console.error('Cart API Error:', error);
    return json({error: 'Internal Server Error'}, {status: 500});
  }
};
