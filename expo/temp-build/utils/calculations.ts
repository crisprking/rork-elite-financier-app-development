import { 
  MortgageCalculation, 
  CarLoanCalculation, 
  AmortizationEntry, 
  MortgageInputs, 
  CarLoanInputs,
  LoanCalculation,
  InvestmentCalculation,
  SavingsGoal,
  PaymentBreakdown,
  AmortizationSchedule,
  ChartDataPoint,
  VALIDATION_LIMITS,
  CURRENCY_SYMBOLS
} from '@/types/financial';

export function calculateMortgage(inputs: MortgageInputs): MortgageCalculation {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceRate,
    pmiRate,
    hoaFees
  } = inputs;

  // Input validation
  if (homePrice <= 0) throw new Error('Home price must be greater than 0');
  if (downPayment < 0) throw new Error('Down payment cannot be negative');
  if (downPayment >= homePrice) throw new Error('Down payment cannot exceed home price');
  if (interestRate < 0 || interestRate > 50) throw new Error('Interest rate must be between 0% and 50%');
  if (loanTerm <= 0 || loanTerm > 50) throw new Error('Loan term must be between 1 and 50 years');
  if (propertyTaxRate < 0 || propertyTaxRate > 10) throw new Error('Property tax rate must be between 0% and 10%');
  if (homeInsuranceRate < 0 || homeInsuranceRate > 5) throw new Error('Home insurance rate must be between 0% and 5%');
  if (pmiRate < 0 || pmiRate > 5) throw new Error('PMI rate must be between 0% and 5%');
  if (hoaFees < 0) throw new Error('HOA fees cannot be negative');

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const loanToValue = (loanAmount / homePrice) * 100;

  // Enhanced monthly mortgage payment calculation with precision
  let monthlyPayment: number;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }

  // Additional monthly costs with proper rounding
  const monthlyPropertyTax = Math.round(((homePrice * propertyTaxRate / 100) / 12) * 100) / 100;
  const monthlyInsurance = Math.round(((homePrice * homeInsuranceRate / 100) / 12) * 100) / 100;
  const monthlyPMI = loanToValue > 80 ? Math.round(((loanAmount * pmiRate / 100) / 12) * 100) / 100 : 0;

  const totalMonthlyPayment = Math.round((monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoaFees) * 100) / 100;
  const totalInterest = Math.round(((monthlyPayment * numPayments) - loanAmount) * 100) / 100;
  const totalCost = Math.round((homePrice + totalInterest + (monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoaFees) * numPayments) * 100) / 100;

  // Calculate accurate principal and interest breakdown for first payment
  const firstMonthInterest = loanAmount * monthlyRate;
  const firstMonthPrincipal = monthlyPayment - firstMonthInterest;

  return {
    loanAmount: Math.round(loanAmount * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    homePrice: Math.round(homePrice * 100) / 100,
    interestRate: Math.round(interestRate * 100) / 100,
    loanTerm,
    propertyTaxes: Math.round((monthlyPropertyTax * 12) * 100) / 100,
    homeInsurance: Math.round((monthlyInsurance * 12) * 100) / 100,
    pmi: Math.round((monthlyPMI * 12) * 100) / 100,
    hoaFees: Math.round((hoaFees * 12) * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalMonthlyPayment,
    totalInterest,
    totalCost,
    loanToValue: Math.round(loanToValue * 100) / 100,
    breakdown: {
      principal: Math.round(firstMonthPrincipal * 100) / 100,
      interest: Math.round(firstMonthInterest * 100) / 100,
      taxes: monthlyPropertyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      hoa: Math.round(hoaFees * 100) / 100
    }
  };
}

export function calculateCarLoan(inputs: CarLoanInputs): CarLoanCalculation {
  const {
    vehiclePrice,
    downPayment,
    tradeInValue,
    interestRate,
    loanTerm,
    salesTaxRate,
    fees
  } = inputs;

  // Input validation
  if (vehiclePrice <= 0) throw new Error('Vehicle price must be greater than 0');
  if (downPayment < 0) throw new Error('Down payment cannot be negative');
  if (tradeInValue < 0) throw new Error('Trade-in value cannot be negative');
  if (downPayment + tradeInValue >= vehiclePrice) throw new Error('Down payment plus trade-in cannot exceed vehicle price');
  if (interestRate < 0 || interestRate > 50) throw new Error('Interest rate must be between 0% and 50%');
  if (loanTerm <= 0 || loanTerm > 10) throw new Error('Loan term must be between 1 and 10 years');
  if (salesTaxRate < 0 || salesTaxRate > 15) throw new Error('Sales tax rate must be between 0% and 15%');
  if (fees < 0) throw new Error('Fees cannot be negative');

  const taxableAmount = vehiclePrice - tradeInValue;
  const salesTax = Math.round((taxableAmount * salesTaxRate / 100) * 100) / 100;
  const totalAmount = vehiclePrice + salesTax + fees;
  const loanAmount = totalAmount - downPayment - tradeInValue;

  if (loanAmount <= 0) {
    return {
      vehiclePrice: Math.round(vehiclePrice * 100) / 100,
      downPayment: Math.round(downPayment * 100) / 100,
      tradeInValue: Math.round(tradeInValue * 100) / 100,
      loanAmount: 0,
      interestRate: Math.round(interestRate * 100) / 100,
      loanTerm,
      salesTax,
      fees: Math.round(fees * 100) / 100,
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: Math.round(totalAmount * 100) / 100
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  let monthlyPayment: number;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }

  const totalInterest = Math.round(((monthlyPayment * numPayments) - loanAmount) * 100) / 100;
  const totalCost = Math.round((totalAmount + totalInterest) * 100) / 100;

  return {
    vehiclePrice: Math.round(vehiclePrice * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    tradeInValue: Math.round(tradeInValue * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
    interestRate: Math.round(interestRate * 100) / 100,
    loanTerm,
    salesTax,
    fees: Math.round(fees * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest,
    totalCost
  };
}

export function generateAmortizationSchedule(
  loanAmount: number,
  interestRate: number,
  loanTerm: number,
  monthlyPayment: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  const monthlyRate = interestRate / 100 / 12;
  let balance = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= loanTerm * 12; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    totalInterest += interestPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      totalInterest
    });

    if (balance <= 0) break;
  }

  return schedule;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

// Professional Investment Calculator
export function calculateInvestment(
  initialAmount: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  compoundFrequency: 'monthly' | 'quarterly' | 'annually' = 'monthly'
): InvestmentCalculation {
  // Input validation
  if (initialAmount < 0) throw new Error('Initial amount cannot be negative');
  if (monthlyContribution < 0) throw new Error('Monthly contribution cannot be negative');
  if (annualReturn < -100 || annualReturn > 100) throw new Error('Annual return must be between -100% and 100%');
  if (years <= 0 || years > 100) throw new Error('Investment period must be between 1 and 100 years');

  const periodsPerYear = compoundFrequency === 'monthly' ? 12 : compoundFrequency === 'quarterly' ? 4 : 1;
  const totalPeriods = years * periodsPerYear;
  const periodRate = annualReturn / 100 / periodsPerYear;
  const monthlyRate = annualReturn / 100 / 12;
  
  // Calculate future value of initial investment
  const futureValueInitial = initialAmount * Math.pow(1 + periodRate, totalPeriods);
  
  // Calculate future value of monthly contributions (annuity)
  let futureValueContributions = 0;
  if (monthlyContribution > 0 && monthlyRate !== 0) {
    const monthsTotal = years * 12;
    futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthsTotal) - 1) / monthlyRate);
  } else if (monthlyContribution > 0) {
    futureValueContributions = monthlyContribution * years * 12;
  }
  
  const finalAmount = futureValueInitial + futureValueContributions;
  const totalContributions = initialAmount + (monthlyContribution * years * 12);
  const totalGains = finalAmount - totalContributions;
  
  return {
    id: generateId(),
    initialAmount: Math.round(initialAmount * 100) / 100,
    monthlyContribution: Math.round(monthlyContribution * 100) / 100,
    annualReturn: Math.round(annualReturn * 100) / 100,
    years,
    compoundFrequency,
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalGains: Math.round(totalGains * 100) / 100,
    createdAt: new Date()
  };
}

// Professional Savings Goal Calculator
export function calculateSavingsGoal(
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number,
  interestRate: number
): SavingsGoal {
  // Input validation
  if (targetAmount <= 0) throw new Error('Target amount must be greater than 0');
  if (currentAmount < 0) throw new Error('Current amount cannot be negative');
  if (monthlyContribution < 0) throw new Error('Monthly contribution cannot be negative');
  if (interestRate < 0 || interestRate > 50) throw new Error('Interest rate must be between 0% and 50%');
  if (currentAmount >= targetAmount) throw new Error('Current amount cannot exceed target amount');

  const monthlyRate = interestRate / 100 / 12;
  const remainingAmount = targetAmount - currentAmount;
  
  let monthsToGoal: number;
  
  if (monthlyContribution === 0) {
    if (interestRate === 0) {
      monthsToGoal = Infinity;
    } else {
      monthsToGoal = Math.log(targetAmount / currentAmount) / Math.log(1 + monthlyRate);
    }
  } else {
    if (interestRate === 0) {
      monthsToGoal = remainingAmount / monthlyContribution;
    } else {
      // Using the formula for future value of annuity plus present value
      const futureValueCurrent = currentAmount;
      const targetMinusCurrent = targetAmount - futureValueCurrent * Math.pow(1 + monthlyRate, 1);
      
      if (targetMinusCurrent <= 0) {
        monthsToGoal = 0;
      } else {
        // Solve for n in: FV = PMT * [((1 + r)^n - 1) / r] + PV * (1 + r)^n
        // This requires numerical methods, so we'll use approximation
        monthsToGoal = Math.log(1 + (targetAmount * monthlyRate) / monthlyContribution) / Math.log(1 + monthlyRate);
      }
    }
  }
  
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + Math.ceil(monthsToGoal));
  
  return {
    id: generateId(),
    targetAmount: Math.round(targetAmount * 100) / 100,
    currentAmount: Math.round(currentAmount * 100) / 100,
    monthlyContribution: Math.round(monthlyContribution * 100) / 100,
    interestRate: Math.round(interestRate * 100) / 100,
    targetDate,
    monthsToGoal: Math.ceil(monthsToGoal),
    createdAt: new Date(),
    title: 'Savings Goal',
    category: 'other'
  };
}

// Enhanced Amortization Schedule with Professional Features
export function generateEnhancedAmortizationSchedule(
  loanAmount: number,
  interestRate: number,
  loanTermYears: number
): AmortizationSchedule {
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  
  // Calculate monthly payment
  let monthlyPayment: number;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }
  
  const schedule: PaymentBreakdown[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    balance = Math.max(0, balance - principalPayment);
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment;
    
    schedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
      cumulativePrincipal: Math.round(cumulativePrincipal * 100) / 100
    });
    
    if (balance <= 0) break;
  }
  
  const summary = {
    totalPayments: Math.round((monthlyPayment * numPayments) * 100) / 100,
    totalInterest: Math.round(cumulativeInterest * 100) / 100,
    totalPrincipal: Math.round(loanAmount * 100) / 100,
    averageMonthlyPayment: Math.round(monthlyPayment * 100) / 100
  };
  
  return { schedule, summary };
}

// Generate Chart Data for Visualizations
export function generateLoanChartData(
  schedule: PaymentBreakdown[]
): { principalData: ChartDataPoint[]; interestData: ChartDataPoint[]; balanceData: ChartDataPoint[] } {
  const principalData: ChartDataPoint[] = [];
  const interestData: ChartDataPoint[] = [];
  const balanceData: ChartDataPoint[] = [];
  
  schedule.forEach((entry, index) => {
    principalData.push({ x: index + 1, y: entry.cumulativePrincipal, label: `Month ${entry.month}` });
    interestData.push({ x: index + 1, y: entry.cumulativeInterest, label: `Month ${entry.month}` });
    balanceData.push({ x: index + 1, y: entry.balance, label: `Month ${entry.month}` });
  });
  
  return { principalData, interestData, balanceData };
}

export function generateInvestmentChartData(
  initialAmount: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const monthlyRate = annualReturn / 100 / 12;
  let currentValue = initialAmount;
  
  data.push({ x: 0, y: currentValue, label: 'Start' });
  
  for (let month = 1; month <= years * 12; month++) {
    currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
    
    if (month % 12 === 0 || month === years * 12) {
      data.push({ 
        x: month / 12, 
        y: Math.round(currentValue * 100) / 100, 
        label: `Year ${month / 12}` 
      });
    }
  }
  
  return data;
}

// Utility Functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrencyDetailed(amount: number, currency: keyof typeof CURRENCY_SYMBOLS = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function calculateLoanAffordability(
  monthlyIncome: number,
  monthlyDebts: number,
  interestRate: number,
  loanTermYears: number,
  debtToIncomeRatio: number = 0.28
): { maxLoanAmount: number; maxMonthlyPayment: number; recommendedDownPayment: number } {
  const maxMonthlyPayment = (monthlyIncome * debtToIncomeRatio) - monthlyDebts;
  
  if (maxMonthlyPayment <= 0) {
    return {
      maxLoanAmount: 0,
      maxMonthlyPayment: 0,
      recommendedDownPayment: 0
    };
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  
  let maxLoanAmount: number;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    maxLoanAmount = maxMonthlyPayment * (factor - 1) / (monthlyRate * factor);
  } else {
    maxLoanAmount = maxMonthlyPayment * numPayments;
  }
  
  const recommendedDownPayment = maxLoanAmount * 0.2; // 20% down payment
  
  return {
    maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
    maxMonthlyPayment: Math.round(maxMonthlyPayment * 100) / 100,
    recommendedDownPayment: Math.round(recommendedDownPayment * 100) / 100
  };
}

// Validation Functions
export function validateLoanInputs(principal: number, rate: number, term: number): string[] {
  const errors: string[] = [];
  
  if (principal < VALIDATION_LIMITS.MIN_LOAN_AMOUNT || principal > VALIDATION_LIMITS.MAX_LOAN_AMOUNT) {
    errors.push(`Loan amount must be between ${formatCurrency(VALIDATION_LIMITS.MIN_LOAN_AMOUNT)} and ${formatCurrency(VALIDATION_LIMITS.MAX_LOAN_AMOUNT)}`);
  }
  
  if (rate < VALIDATION_LIMITS.MIN_INTEREST_RATE || rate > VALIDATION_LIMITS.MAX_INTEREST_RATE) {
    errors.push(`Interest rate must be between ${VALIDATION_LIMITS.MIN_INTEREST_RATE}% and ${VALIDATION_LIMITS.MAX_INTEREST_RATE}%`);
  }
  
  if (term < VALIDATION_LIMITS.MIN_TERM_YEARS || term > VALIDATION_LIMITS.MAX_TERM_YEARS) {
    errors.push(`Loan term must be between ${VALIDATION_LIMITS.MIN_TERM_YEARS} and ${VALIDATION_LIMITS.MAX_TERM_YEARS} years`);
  }
  
  return errors;
}

export function calculateBreakEvenPoint(
  loanAmount: number,
  interestRate: number,
  refinanceRate: number,
  refinanceCosts: number,
  remainingTermYears: number
): { breakEvenMonths: number; monthlySavings: number; totalSavings: number } {
  const currentMonthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, remainingTermYears);
  const newMonthlyPayment = calculateMonthlyPayment(loanAmount, refinanceRate, remainingTermYears);
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  
  if (monthlySavings <= 0) {
    return {
      breakEvenMonths: Infinity,
      monthlySavings: 0,
      totalSavings: 0
    };
  }
  
  const breakEvenMonths = Math.ceil(refinanceCosts / monthlySavings);
  const totalSavings = (monthlySavings * remainingTermYears * 12) - refinanceCosts;
  
  return {
    breakEvenMonths,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100
  };
}

function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return principal * (monthlyRate * factor) / (factor - 1);
}