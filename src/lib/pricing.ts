/**
 * Centralized pricing configuration for Luna
 * All prices and Stripe price IDs are defined here to maintain consistency
 */

export const PRICING_CONFIG = {
  brl: {
    currency: 'BRL',
    symbol: 'R$',
    free: {
      monthly: 0,
      yearly: 0,
    },
    premium: {
      monthly: 19.90,
      yearly: 199.00,
      stripePriceId: {
        monthly: "price_1SX6CVIEVFZTiFWxkPKHuWRw",
        yearly: "price_1SX6CjIEVFZTiFWxlX10yitN",
      }
    },
    premiumPlus: {
      monthly: 29.90,
      yearly: 299.00,
      stripePriceId: {
        monthly: "price_1SYebkIEVFZTiFWxFUKducJE",
        yearly: "price_1SYghcIEVFZTiFWxxqiCmWth",
      }
    }
  },
  usd: {
    currency: 'USD',
    symbol: '$',
    free: {
      monthly: 0,
      yearly: 0,
    },
    premium: {
      monthly: 9.90,
      yearly: 99.00,
      stripePriceId: {
        monthly: "price_1SXPuTIEVFZTiFWxVohXH8xe",
        yearly: "price_1SXPucIEVFZTiFWxAaZO1YyI",
      }
    },
    premiumPlus: {
      monthly: 19.90,
      yearly: 199.00,
      stripePriceId: {
        monthly: "price_1SYeblIEVFZTiFWxuoxqWS4o",
        yearly: "price_1SYghdIEVFZTiFWx6jTEbMet",
      }
    }
  }
} as const;

export type Currency = keyof typeof PRICING_CONFIG;

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount: number, currency: Currency): string => {
  const config = PRICING_CONFIG[currency];
  return `${config.symbol} ${amount.toFixed(2).replace('.', ',')}`;
};

/**
 * Get the appropriate currency based on country code
 */
export const getCurrencyByCountry = (countryCode: string): Currency => {
  return countryCode === 'BR' ? 'brl' : 'usd';
};

/**
 * Detect user's country and return appropriate currency
 */
export const detectUserCurrency = async (): Promise<Currency> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code || 'BR';
    return getCurrencyByCountry(countryCode);
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'brl'; // Default to BRL if detection fails
  }
};
