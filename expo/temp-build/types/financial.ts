// Core calculation interfaces
export interface LoanCalculation {
  id: string;
  type: 'mortgage' | 'car' | 'personal' | 'investment' | 'savings';
  principal: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  createdAt: Date;
  title?: string;
  downPayment?: number;
  propertyTax?: number;
  insurance?: number;
  pmi?: number;
}

export interface PaymentBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface InvestmentCalculation {
  id: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  compoundFrequency: 'monthly' | 'quarterly' | 'annually';
  finalAmount: number;
  totalContributions: number;
  totalGains: number;
  createdAt: Date;
  title?: string;
}

export interface SavingsGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  interestRate: number;
  targetDate: Date;
  monthsToGoal: number;
  createdAt: Date;
  title: string;
  category: 'emergency' | 'vacation' | 'house' | 'car' | 'retirement' | 'other';
}

// Legacy interfaces for backward compatibility
export interface MortgageCalculation {
  loanAmount: number;
  downPayment: number;
  homePrice: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxes: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
  monthlyPayment: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  loanToValue: number;
  breakdown: {
    principal: number;
    interest: number;
    taxes: number;
    insurance: number;
    pmi: number;
    hoa: number;
  };
}

export interface CarLoanCalculation {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  salesTax: number;
  fees: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsuranceRate: number;
  pmiRate: number;
  hoaFees: number;
}

export interface CarLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  interestRate: number;
  loanTerm: number;
  salesTaxRate: number;
  fees: number;
}

// App-wide interfaces
export interface CalculationHistory {
  loans: LoanCalculation[];
  investments: InvestmentCalculation[];
  savings: SavingsGoal[];
}

export interface UserPreferences {
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  biometricAuth: boolean;
  defaultLoanTerm: number;
  defaultInterestRate: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'free' | 'pro' | 'premium';
  expiresAt?: Date;
  features: {
    unlimitedCalculations: boolean;
    advancedCharts: boolean;
    exportToPDF: boolean;
    historicalData: boolean;
    customCategories: boolean;
    prioritySupport: boolean;
  };
}

export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface AmortizationSchedule {
  schedule: PaymentBreakdown[];
  summary: {
    totalPayments: number;
    totalInterest: number;
    totalPrincipal: number;
    averageMonthlyPayment: number;
  };
}

export type CalculationType = 'loan' | 'investment' | 'savings' | 'mortgage' | 'refinance';

export interface CalculationInput {
  type: CalculationType;
  values: Record<string, number | string>;
  metadata?: Record<string, any>;
}

export interface CalculationResult {
  id: string;
  input: CalculationInput;
  result: LoanCalculation | InvestmentCalculation | SavingsGoal;
  charts: {
    amortization?: ChartDataPoint[];
    growth?: ChartDataPoint[];
    breakdown?: ChartDataPoint[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includeSchedule: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Constants
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
} as const;

export const LOAN_TYPES = {
  mortgage: 'Mortgage',
  car: 'Auto Loan',
  personal: 'Personal Loan',
  student: 'Student Loan',
  business: 'Business Loan',
} as const;

export const INVESTMENT_TYPES = {
  stocks: 'Stock Market',
  bonds: 'Bonds',
  mutual_funds: 'Mutual Funds',
  etf: 'ETFs',
  real_estate: 'Real Estate',
  crypto: 'Cryptocurrency',
} as const;

export const SAVINGS_CATEGORIES = {
  emergency: 'Emergency Fund',
  vacation: 'Vacation',
  house: 'House Down Payment',
  car: 'New Car',
  retirement: 'Retirement',
  education: 'Education',
  other: 'Other',
} as const;

// Default values
export const DEFAULT_LOAN_VALUES = {
  principal: 250000,
  interestRate: 6.5,
  termYears: 30,
  downPayment: 50000,
} as const;

export const DEFAULT_INVESTMENT_VALUES = {
  initialAmount: 10000,
  monthlyContribution: 500,
  annualReturn: 7,
  years: 20,
} as const;

export const DEFAULT_SAVINGS_VALUES = {
  targetAmount: 10000,
  currentAmount: 0,
  monthlyContribution: 300,
  interestRate: 2.5,
} as const;

// Validation constants
export const VALIDATION_LIMITS = {
  MIN_LOAN_AMOUNT: 1000,
  MAX_LOAN_AMOUNT: 10000000,
  MIN_INTEREST_RATE: 0,
  MAX_INTEREST_RATE: 50,
  MIN_TERM_YEARS: 1,
  MAX_TERM_YEARS: 50,
  MIN_MONTHLY_PAYMENT: 1,
  MAX_MONTHLY_PAYMENT: 100000,
} as const;

// Feature flags
export const FEATURES = {
  ADVANCED_CHARTS: 'advanced_charts',
  PDF_EXPORT: 'pdf_export',
  UNLIMITED_HISTORY: 'unlimited_history',
  CUSTOM_CATEGORIES: 'custom_categories',
  BIOMETRIC_AUTH: 'biometric_auth',
  PUSH_NOTIFICATIONS: 'push_notifications',
  DARK_MODE: 'dark_mode',
  MULTI_CURRENCY: 'multi_currency',
} as const;

export type FeatureFlag = typeof FEATURES[keyof typeof FEATURES];

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  SUBSCRIPTION_ERROR: 'SUBSCRIPTION_ERROR',
  EXPORT_ERROR: 'EXPORT_ERROR',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];