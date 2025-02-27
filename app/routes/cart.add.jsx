import {json} from '@shopify/remix-oxygen';
import {ShopifyCartClient} from 'aov-shopify-headless-cart-test';
import {Form} from '@remix-run/react';

// Thêm component UI để render
export default function AddToCart() {
  return (
    <div style={{padding: '20px'}}>
      <h2>Test Add to Cart API</h2>
      <Form method="post">
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#008060',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Test Product to Cart
        </button>
      </Form>
    </div>
  );
}

export async function loader({params}) {
  return json({error: 'Method not allowed'}, {status: 405});
}

export async function action({request, context}) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

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
    // Sử dụng một variant ID thực từ shop của bạn
    const testLines = [{
      merchandiseId: "gid://shopify/ProductVariant/44876984615164", // Thay bằng ID thực từ shop của bạn
      quantity: 1
    }];

    console.log("Starting add to cart test...");
    const newCart = await cartClient.addToCart(cartData?.id, testLines);
    console.log("Cart created:", newCart);

    return json({
      success: true,
      cart: newCart,
      message: "Test add to cart successful"
    });

  } catch (error) {
    console.error('Cart API Error:', error);
    return json({
      error: 'Internal Server Error', 
      details: error.message
    }, {status: 500});
  }
} 