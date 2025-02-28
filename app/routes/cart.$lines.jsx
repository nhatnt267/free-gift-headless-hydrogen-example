import {redirect} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {ShopifyCartClient} from 'aov-shopify-headless-cart-test';
/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure:
 * ```js
 * /cart/<variant_id>:<quantity>
 *
 * ```
 *
 * More than one `<variant_id>:<quantity>` separated by a comma, can be supplied in the URL, for
 * carts with more than one product variant.
 *
 * @example
 * Example path creating a cart with two product variants, different quantities, and a discount code in the querystring:
 * ```js
 * /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 *
 * ```
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context, params}) {
  if (request.method !== 'GET') {
    return json({error: 'Method Not Allowed'}, {status: 405});
  }
  const {cart} = context;
  const {lines} = params;

  if (lines === 'add.js' || lines === 'update.js' || lines === 'change.js') {
    return json({success: true}, {status: 200});
  }
  if (!lines) return redirect('/cart');
  const linesMap = lines.split(',').map((line) => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1], 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity,
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];
  // create a cart
  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray,
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410,
    });
  }

  // Update cart id in cookie
  const headers = cart.setCartId(cartResult.id);

  // redirect to checkout
  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, {headers});
  } else {
    throw new Error('No checkout URL found');
  }
}

export async function action({request, context, params}) {
  try {
    const {env, cart} = context;
    const {lines} = params;
    if (!lines) return json({error: 'Lines are required'}, {status: 400});
    const body = await request.json();
    const cartData = await cart.get();
    const cartClient = new ShopifyCartClient({
      config: {
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        accessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        cartId: cartData.id,
      },
    });
    switch (lines) {
      case 'add.js':
        const {items = []} = body;
        await cartClient.addToCart(items);
        return json({success: true}, {status: 200});

      case 'update.js':
        const {updates = {}} = body;
        await cartClient.updateCartItemsForLineId(updates);
        return json({success: true}, {status: 200});

      case 'change.js':
        await cartClient.changeCartItem({...body});
        return json({success: true}, {status: 200});

      default:
        return json({error: 'Invalid action'}, {status: 400});
    }
  } catch (error) {
    console.error('Cart API Error:', error);
    return json({error: 'Internal Server Error'}, {status: 500});
  }
}

export default function Component() {
  return null;
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
