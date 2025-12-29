import { useTranslation } from "react-i18next";
import { useCallback } from "react";

/**
 * Hook that provides safe translation with fallback values
 * When a translation key returns the key itself (missing translation),
 * it returns the fallback value instead
 */
export const useSafeTranslation = () => {
  const { t, i18n } = useTranslation();

  /**
   * Safe translation function that never shows raw keys
   * @param key - Translation key (e.g., "footer.product")
   * @param fallback - Fallback text to show if translation is missing
   * @param options - Optional i18next options
   */
  const ts = useCallback(
    (key: string, fallback: string, options?: object): string => {
      const result = t(key, { defaultValue: fallback, ...options });
      // If the result equals the key, the translation is missing
      return result === key ? fallback : result;
    },
    [t]
  );

  return { t, ts, i18n };
};

export default useSafeTranslation;
