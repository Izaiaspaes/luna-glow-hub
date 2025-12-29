// DataLayer utility for GTM integration

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

// Initialize dataLayer if not exists
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}

export const pushToDataLayer = (event: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    console.log('[DataLayer]', event);
  }
};

// View pricing page
export const trackViewPricing = () => {
  pushToDataLayer({
    event: 'view_pricing',
    page_type: 'pricing'
  });
};

// Begin checkout - when user clicks subscribe
export const trackBeginCheckout = (params: {
  priceId: string;
  planType: 'premium' | 'premium_plus';
  billingPeriod: 'monthly' | 'yearly';
  currency: string;
  value: number;
}) => {
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: params.currency.toUpperCase(),
      value: params.value,
      items: [{
        item_id: params.priceId,
        item_name: params.planType === 'premium_plus' ? 'Premium Plus' : 'Premium',
        item_category: 'subscription',
        price: params.value,
        quantity: 1
      }]
    },
    plan_type: params.planType,
    billing_period: params.billingPeriod
  });
};

// Purchase complete - on success page
export const trackPurchase = (params: {
  planType: 'premium' | 'premium_plus';
  transactionId?: string;
}) => {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: params.transactionId || `txn_${Date.now()}`,
      items: [{
        item_name: params.planType === 'premium_plus' ? 'Premium Plus' : 'Premium',
        item_category: 'subscription',
        quantity: 1
      }]
    },
    plan_type: params.planType
  });
};

// Sign up complete - after onboarding
export const trackSignUp = (params?: {
  method?: string;
}) => {
  pushToDataLayer({
    event: 'sign_up',
    method: params?.method || 'email'
  });
};

// Quiz complete - when user finishes quiz on landing page
export const trackQuizComplete = (params: {
  result?: string;
  language?: string;
}) => {
  pushToDataLayer({
    event: 'quiz_complete',
    quiz_result: params.result,
    language: params.language
  });
};

// Lead - when user submits newsletter form
export const trackLead = (params?: {
  source?: string;
}) => {
  pushToDataLayer({
    event: 'generate_lead',
    lead_source: params?.source || 'newsletter'
  });
};

// CTA Click - track main CTA button clicks
export const trackCTAClick = (params: {
  ctaLocation: string;
  ctaText: string;
  destination?: string;
}) => {
  pushToDataLayer({
    event: 'cta_click',
    cta_location: params.ctaLocation,
    cta_text: params.ctaText,
    cta_destination: params.destination || 'unknown'
  });
};

// Button Click - generic button tracking
export const trackButtonClick = (params: {
  buttonName: string;
  buttonLocation: string;
  buttonType?: 'primary' | 'secondary' | 'outline';
}) => {
  pushToDataLayer({
    event: 'button_click',
    button_name: params.buttonName,
    button_location: params.buttonLocation,
    button_type: params.buttonType || 'primary'
  });
};

// Start Onboarding - when user clicks to start onboarding
export const trackStartOnboarding = (params?: {
  source?: string;
}) => {
  pushToDataLayer({
    event: 'start_onboarding',
    onboarding_source: params?.source || 'unknown'
  });
};

// View Features - when user clicks to view features
export const trackViewFeatures = (params?: {
  source?: string;
}) => {
  pushToDataLayer({
    event: 'view_features',
    features_source: params?.source || 'unknown'
  });
};
