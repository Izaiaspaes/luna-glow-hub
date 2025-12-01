import { useState, useEffect } from 'react';
import { detectUserCurrency, type Currency } from '@/lib/pricing';

/**
 * Hook to detect and manage user's currency
 * Automatically detects currency on mount based on user's location
 */
export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>('brl');
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string>('BR');

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code || 'BR';
        setCountryCode(country);
        
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);
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
