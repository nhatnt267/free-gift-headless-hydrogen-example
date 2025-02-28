import {useEffect} from 'react';

const fgSdk = `https://cdn.shopify.com/extensions/5e2b8eb3-5720-4075-8ce3-fe9c434c4cf2/0.0.0/assets/avada-free-gift-main.min.js?v=${new Date().getTime()}`;

export default function useInitFG(data) {
  useEffect(() => {
    const initialize = async () => {
      try {
        const {dataMetafield, publicStoreDomain, fgShopData} = data;

        window.AVADA_FREE_GIFTS = {
          ...(window.AVADA_FREE_GIFTS || {}),
          ...dataMetafield,
          isHeadless: true,
        };

        window.Shopify = window.Shopify || {};

        window.Shopify.currency = window.Shopify.currency || {
          active: fgShopData?.currencyCode,
          rate: '1.0', // Default rate
        };
        window.Shopify.locale = fgShopData?.locale?.toLowerCase() || null;
        window.Shopify.country = fgShopData?.countryCode || null;
        window.Shopify.shop = publicStoreDomain || null;

        loadScript({
          id: 'avada-fg-script',
          url: fgSdk,
        });
      } catch (error) {
        console.error('Cannot initialize Free Gift:', error);
      }
    };
    initialize();
  }, []);
}

function loadScript({id = null, url = null} = {}) {
  const hasScript = document.querySelector(`#${id}`);
  if (!hasScript) {
    const script = document.createElement('script');
    script.id = id;
    script.setAttribute('src', url);
    script.async = true;
    document.body.appendChild(script);
  }
}
