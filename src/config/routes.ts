export const routes = {
  home: '/',
  matchers: {
    home: /\/$/,
  },

  account: {
    create: '/index.php?rt=account/create',
    login: '/index.php?rt=account/login',
    logout: '/index.php?rt=account/logout',
    matchers: {
      create: /rt=account\/create/,
      login: /rt=account\/login/,
      logout: /rt=account\/logout/,
      success: /rt=account\/success/,
    },
  },

  checkout: {
    cart: '/index.php?rt=checkout/cart',
    matchers: {
      cart: /rt=checkout\/cart/,
    },
  },

  product: {
    category: '/index.php?rt=product/category',
    specials: '/index.php?rt=product/special',
    search: (keyword: string) => `/index.php?rt=product/search&keyword=${encodeURIComponent(keyword)}`,
    matchers: {
      search: /(?:rt=product\/search|[?&]filter_keyword=)/,
      category: /rt=product\/category&path=/,
      specials: /rt=product\/special/,
      details: /rt=product\/product.*product_id=/,
    },
  },
} as const;
