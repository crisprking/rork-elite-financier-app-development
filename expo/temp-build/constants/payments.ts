export interface PayLink {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  highlight?: string;
  checkoutUrl: string;
}

export interface PaymentsConfig {
  currency: 'USD';
  plans: PayLink[];
  termsUrl: string;
  privacyUrl: string;
  supportEmail: string;
}

export const paymentsConfig: PaymentsConfig = {
  currency: 'USD',
  plans: [
    {
      id: 'pro-monthly',
      title: 'FlowPro — Monthly',
      subtitle: '7-day free trial, then $9.99/mo',
      priceLabel: '$9.99/mo',
      highlight: 'Best to start',
      checkoutUrl: 'https://buy.stripe.com/test_XXXX_monthly',
    },
    {
      id: 'pro-annual',
      title: 'FlowPro — Annual',
      subtitle: '2 months free compared to monthly',
      priceLabel: '$99.99/yr',
      highlight: 'Most value',
      checkoutUrl: 'https://buy.stripe.com/test_XXXX_annual',
    },
    {
      id: 'business',
      title: 'FlowBusiness',
      subtitle: 'For teams and brokerages',
      priceLabel: '$99/mo',
      checkoutUrl: 'https://buy.stripe.com/test_XXXX_business',
    },
  ],
  termsUrl: 'https://example.com/terms',
  privacyUrl: 'https://example.com/privacy',
  supportEmail: 'support@example.com',
};
