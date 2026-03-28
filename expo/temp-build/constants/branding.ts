export const APP_NAME = 'FinSage Pro';
export const TAGLINE = 'Your AI Financial Advisor';
export const MASCOT_URL = 'https://r2-pub.rork.com/generated-images/b769c3d6-6fac-4f1b-8ff2-a07249e869c4.png';

// Brand Story & Narrative (Viral-Ready)
export const BRAND_STORY = {
  mission: 'Making everyone a financial genius with AI',
  vision: 'Transform your financial future, one smart decision at a time',
  personality: 'Wise sage meets tech genius - your personal financial mentor',
  tone: 'Empowering, intelligent, and surprisingly fun',
  values: ['Financial Freedom', 'AI-Powered Wisdom', 'Viral Growth', 'Life-Changing Results'],
  viralHook: 'The app that turns anyone into a financial expert',
  socialProof: 'Join 50,000+ users building wealth with AI',
  emotionalTriggers: {
    fear: 'Stop losing money on bad financial decisions',
    aspiration: 'Build the wealth you deserve',
    social: 'Share your financial wins with friends',
    achievement: 'Unlock your financial potential'
  }
} as const;

// Viral Elements (Duolingo-inspired financial gamification)
export const ENGAGEMENT_ELEMENTS = {
  streaks: {
    title: 'Financial Wisdom Streak',
    messages: {
      start: 'Start your journey to financial freedom! 🚀',
      maintain: 'Keep building that wealth mindset! 💪',
      celebrate: 'You\'re on fire! Your future self will thank you! 🔥',
      comeback: 'Welcome back, financial genius! Let\'s continue building wealth! 💎'
    }
  },
  achievements: {
    firstCalculation: { title: 'First Step', emoji: '🎯', description: 'Every expert was once a beginner' },
    weekStreak: { title: 'Consistency King', emoji: '👑', description: 'Building wealth habits that last' },
    savingsGoal: { title: 'Money Saver', emoji: '💰', description: 'You just saved thousands!' },
    shareWin: { title: 'Wealth Influencer', emoji: '📈', description: 'Inspiring others to build wealth' },
    proUpgrade: { title: 'Financial Elite', emoji: '⭐', description: 'Unlocked professional-grade insights' }
  },
  challenges: {
    weekly: 'Complete 3 calculations this week',
    monthly: 'Optimize your biggest financial decision',
    social: 'Share your savings win with friends'
  },
  social: {
    shareTemplates: {
      savings: 'Just saved $X with @FinSagePro! This AI financial advisor is incredible 🤯',
      milestone: 'Hit my financial goal with help from @FinSagePro! Who else is building wealth? 💪',
      streak: 'Day X of building my financial future with @FinSagePro! Join me? 🚀'
    }
  },
  gamification: {
    levels: ['Beginner', 'Smart Saver', 'Wealth Builder', 'Financial Genius', 'Money Master'],
    rewards: ['Unlock advanced calculators', 'Get premium insights', 'Access exclusive content']
  }
} as const;

// Brand colors for consistent theming
export const BRAND_COLORS = {
  primary: '#00E67A',
  primaryDark: '#00D166',
  premium: '#F59E0B',
  premiumDark: '#D97706',
  textBlack: '#000000',
  textWhite: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceDark: '#1A1A1A',
  sage: '#059669', // Sage green for wisdom
  trust: '#0EA5E9', // Trust blue
  success: '#10B981', // Success green
  warning: '#F59E0B', // Premium gold
} as const;

// Logo variants for different contexts
export const LOGO_VARIANTS = {
  primary: MASCOT_URL, // Main FinSage mascot
  icon: MASCOT_URL, // Icon version
  wordmark: 'FinSage Pro', // Text-only version
  premium: MASCOT_URL, // Premium version with golden accent
} as const;

// Viral Marketing Copy
export const VIRAL_COPY = {
  appStore: {
    title: 'FinSage Pro: AI Financial Advisor',
    subtitle: 'Transform Your Financial Future',
    description: 'The AI-powered financial advisor that\'s helped 50,000+ users save millions. Get professional-grade mortgage, loan, and investment analysis in seconds.',
    keywords: 'finance calculator mortgage loan AI advisor money savings investment planning wealth building'
  },
  social: {
    tagline: 'The app that turns anyone into a financial genius',
    hashtags: ['#FinSagePro', '#FinancialFreedom', '#AIAdvisor', '#WealthBuilding', '#SmartMoney'],
    callToAction: 'Download FinSage Pro and start building wealth today!'
  },
  onboarding: {
    welcome: 'Welcome to your financial transformation!',
    promise: 'In the next 5 minutes, you\'ll make smarter financial decisions than 90% of people.',
    cta: 'Let\'s build your wealth together'
  }
} as const;

// Monetization Strategy
export const MONETIZATION = {
  freeTier: {
    calculations: 3,
    features: ['Basic calculator', 'Simple results', 'Limited sharing']
  },
  trialTier: {
    duration: 7,
    features: ['Unlimited calculations', 'AI insights', 'Advanced analytics', 'Export reports']
  },
  proTier: {
    price: '$4.99/month',
    yearlyPrice: '$29.99/year',
    features: [
      'Unlimited everything',
      'AI-powered insights',
      'Professional reports',
      'Advanced scenarios',
      'Priority support',
      'Exclusive content'
    ],
    valueProps: [
      'Save thousands on your mortgage',
      'Optimize your investments',
      'Make smarter financial decisions',
      'Build wealth faster'
    ]
  }
} as const;
