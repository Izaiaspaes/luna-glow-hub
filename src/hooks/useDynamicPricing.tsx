import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PRICING_CONFIG, Currency, formatPrice as staticFormatPrice } from "@/lib/pricing";

interface PriceSetting {
  id: string;
  plan_type: 'premium' | 'premium_plus';
  currency: 'brl' | 'usd';
  billing_period: 'monthly' | 'yearly';
  price: number;
  stripe_price_id: string;
  is_active: boolean;
  is_promotion: boolean;
  promotion_start_date: string | null;
  promotion_end_date: string | null;
}

interface DynamicPricing {
  brl: {
    currency: 'BRL';
    symbol: 'R$';
    free: { monthly: number; yearly: number };
    premium: {
      monthly: number;
      yearly: number;
      stripePriceId: { monthly: string; yearly: string };
    };
    premiumPlus: {
      monthly: number;
      yearly: number;
      stripePriceId: { monthly: string; yearly: string };
    };
  };
  usd: {
    currency: 'USD';
    symbol: '$';
    free: { monthly: number; yearly: number };
    premium: {
      monthly: number;
      yearly: number;
      stripePriceId: { monthly: string; yearly: string };
    };
    premiumPlus: {
      monthly: number;
      yearly: number;
      stripePriceId: { monthly: string; yearly: string };
    };
  };
}

export const useDynamicPricing = () => {
  const [pricing, setPricing] = useState<DynamicPricing>(PRICING_CONFIG as DynamicPricing);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('price_settings')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          // Build dynamic pricing from database
          const dynamicPricing: DynamicPricing = {
            brl: {
              currency: 'BRL',
              symbol: 'R$',
              free: { monthly: 0, yearly: 0 },
              premium: {
                monthly: PRICING_CONFIG.brl.premium.monthly,
                yearly: PRICING_CONFIG.brl.premium.yearly,
                stripePriceId: { ...PRICING_CONFIG.brl.premium.stripePriceId },
              },
              premiumPlus: {
                monthly: PRICING_CONFIG.brl.premiumPlus.monthly,
                yearly: PRICING_CONFIG.brl.premiumPlus.yearly,
                stripePriceId: { ...PRICING_CONFIG.brl.premiumPlus.stripePriceId },
              },
            },
            usd: {
              currency: 'USD',
              symbol: '$',
              free: { monthly: 0, yearly: 0 },
              premium: {
                monthly: PRICING_CONFIG.usd.premium.monthly,
                yearly: PRICING_CONFIG.usd.premium.yearly,
                stripePriceId: { ...PRICING_CONFIG.usd.premium.stripePriceId },
              },
              premiumPlus: {
                monthly: PRICING_CONFIG.usd.premiumPlus.monthly,
                yearly: PRICING_CONFIG.usd.premiumPlus.yearly,
                stripePriceId: { ...PRICING_CONFIG.usd.premiumPlus.stripePriceId },
              },
            },
          };

          // Override with database values
          (data as PriceSetting[]).forEach((price) => {
            const currencyKey = price.currency as 'brl' | 'usd';
            const planKey = price.plan_type === 'premium' ? 'premium' : 'premiumPlus';
            const periodKey = price.billing_period as 'monthly' | 'yearly';

            // Check if promotion is currently active
            const now = new Date();
            const isPromotionActive = price.is_promotion && 
              price.promotion_start_date && 
              price.promotion_end_date &&
              new Date(price.promotion_start_date) <= now &&
              new Date(price.promotion_end_date) >= now;

            // Only apply price if it's not a promotion or if promotion is active
            if (!price.is_promotion || isPromotionActive) {
              dynamicPricing[currencyKey][planKey][periodKey] = price.price;
              dynamicPricing[currencyKey][planKey].stripePriceId[periodKey] = price.stripe_price_id;
            }
          });

          setPricing(dynamicPricing);
        }
      } catch (err) {
        console.error('Error fetching dynamic prices:', err);
        setError('Failed to load prices');
        // Keep using static pricing as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const formatPrice = (amount: number, currency: Currency): string => {
    return staticFormatPrice(amount, currency);
  };

  const getPrices = (currency: Currency) => {
    return pricing[currency];
  };

  return {
    pricing,
    isLoading,
    error,
    formatPrice,
    getPrices,
  };
};
