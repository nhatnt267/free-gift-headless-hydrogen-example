export default function formatProduct(product) {
  return {
    id: parseInt(product.id.split('/').pop(), 10),
    variants: product.options[0]?.optionValues.map((optionValue) => {
      const variant = optionValue.firstSelectableVariant;
      return {
        id: parseInt(variant.id.split('/').pop(), 10),
        title: variant.title || null,
        option1: optionValue.name || null,
        option2: null,
        option3: null,
        sku: variant.sku || null,
        requires_shipping: true,
        taxable: false,
        featured_image: variant.image ? variant.image.url : null,
        available: variant.availableForSale,
        name: `${product.title} ${variant.title}`,
        public_title: null,
        options: [optionValue.name],
        price: parseInt(variant.price.amount * 100),
        weight: 0,
        compare_at_price: variant.compareAtPrice
          ? parseInt(variant.compareAtPrice.amount * 100)
          : null,
        inventory_management: 'shopify',
        barcode: null,
        requires_selling_plan: false,
        selling_plan_allocations: [],
        quantity_rule: {
          min: 1,
          max: null,
          increment: 1,
        },
      };
    }),
    selectedVariant: null,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,

    price: parseInt(product.selectedOrFirstAvailableVariant.price.amount * 100),
    hasOnlyDefaultVariant: product.options.length === 1,
    available: product.selectedOrFirstAvailableVariant.availableForSale,
    image: product.selectedOrFirstAvailableVariant.image?.url || null,
    options: product.options.map((option, index) => ({
      name: option.name,
      position: index + 1,
      values: option.optionValues.map((value) => value.name),
    })),
    collectionIds: product.collections?.edges.map((edge) =>
      parseInt(edge.node.id.split('/').pop(), 10),
    ),
    collectionTitles: product.collections?.edges.map((edge) => edge.node.title),
  };
}
