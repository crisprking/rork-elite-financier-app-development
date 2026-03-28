// In-App Purchase Product IDs - Updated to match App Store Connect
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'com.rork.nest.focus.monthly.subscription',
  PREMIUM_ANNUAL: 'com.rork.nest.focus.annual.subscription',
  AI_BOOST_PACK: 'com.rork.lunarising.aiboost.pack',
} as const;

// Pricing Information - Market-Optimized for App Store
export const PRICING = {
  PREMIUM_MONTHLY: {
    id: PRODUCT_IDS.PREMIUM_MONTHLY,
    price: 3.99, // Competitive with market leaders
    currency: 'USD',
    title: 'Premium Monthly',
    description: 'Unlimited AI insights and premium features',
    features: [
      'Unlimited AI insights',
      'Advanced analytics',
      'Premium achievements',
      'Priority support',
      'Data export',
    ],
  },
  PREMIUM_ANNUAL: {
    id: PRODUCT_IDS.PREMIUM_ANNUAL,
    price: 19.99, // Excellent value - 58% savings vs monthly
    currency: 'USD',
    title: 'Premium Annual',
    description: 'Best value - Save 58% with annual subscription',
    features: [
      'Unlimited AI insights',
      'Advanced analytics',
      'Premium achievements',
      'Priority support',
      'Data export',
      '58% savings vs monthly',
    ],
  },
  AI_BOOST_PACK: {
    id: PRODUCT_IDS.AI_BOOST_PACK,
    price: 1.99, // Perfectly positioned in market range
    currency: 'USD',
    title: 'AI Boost Pack',
    description: '50 additional AI insights',
    features: [
      '50 AI insights',
      'Personalized recommendations',
      'Success factor analysis',
    ],
  },
} as const;

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_HABITS: 8,
  AI_BOOSTS_PER_DAY: 3,
  AI_BOOSTS_TOTAL: 50,
  BASIC_ANALYTICS: true,
  PREMIUM_ANALYTICS: false,
} as const;

// Premium tier benefits
export const PREMIUM_BENEFITS = {
  UNLIMITED_HABITS: true,
  UNLIMITED_AI_BOOSTS: true,
  ADVANCED_ANALYTICS: true,
  PREMIUM_ACHIEVEMENTS: true,
  PRIORITY_SUPPORT: true,
  EXPORT_DATA: true,
  CUSTOM_THEMES: true,
} as const;
