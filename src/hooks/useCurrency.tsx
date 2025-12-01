import { useState, useEffect } from 'react';
import { detectUserCurrency, type Currency } from '@/lib/pricing';

const CURRENCY_CACHE_KEY = 'luna_user_currency';
const COUNTRY_CACHE_KEY = 'luna_user_country';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Hook to detect and manage user's currency with local caching
 * Automatically detects currency on mount based on user's location
 * Caches result for 7 days to avoid repeated API calls
 */
export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>('brl');
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string>('BR');

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(CURRENCY_CACHE_KEY);
        const cachedCountry = localStorage.getItem(COUNTRY_CACHE_KEY);
        
        if (cachedData && cachedCountry) {
          const { currency: cachedCurrency, timestamp } = JSON.parse(cachedData);
          const now = Date.now();
          
          // Use cached data if less than 7 days old
          if (now - timestamp < CACHE_DURATION) {
            setCurrency(cachedCurrency);
            setCountryCode(cachedCountry);
            setIsLoading(false);
            return;
          }
        }

        // Fetch fresh data if no cache or expired
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code || 'BR';
        setCountryCode(country);
        
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);

        // Save to cache
        localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({
          currency: detectedCurrency,
          timestamp: Date.now()
        }));
        localStorage.setItem(COUNTRY_CACHE_KEY, country);
      } catch (error) {
        console.error('Error detecting currency:', error);
        setCurrency('brl');
        setCountryCode('BR');
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  return { currency, setCurrency, isLoading, countryCode };
};
