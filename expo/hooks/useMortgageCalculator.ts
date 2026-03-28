import { useState, useMemo, useCallback } from 'react';
import { MortgageInputs, MortgageCalculation } from '@/types/financial';
import { calculateMortgage, generateAmortizationSchedule } from '@/utils/calculations';

function buildFallbackCalculation(inputs: MortgageInputs): MortgageCalculation {
  const loanAmount = Math.max(0, inputs.homePrice - inputs.downPayment);
  return {
    loanAmount,
    downPayment: inputs.downPayment,
    homePrice: inputs.homePrice,
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTerm,
    propertyTaxes: 0,
    homeInsurance: 0,
    pmi: 0,
    hoaFees: inputs.hoaFees,
    monthlyPayment: 0,
    totalMonthlyPayment: 0,
    totalInterest: 0,
    totalCost: inputs.homePrice,
    loanToValue: loanAmount > 0 && inputs.homePrice > 0 ? (loanAmount / inputs.homePrice) * 100 : 0,
    breakdown: {
      principal: 0,
      interest: 0,
      taxes: 0,
      insurance: 0,
      pmi: 0,
      hoa: inputs.hoaFees,
    },
  };
}

export function useMortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 7.25,
    loanTerm: 30,
    propertyTaxRate: 1.25,
    homeInsuranceRate: 0.35,
    pmiRate: 0.5,
    hoaFees: 0,
  });

  const [error, setError] = useState<string | null>(null);

  const calculation: MortgageCalculation = useMemo(() => {
    try {
      const result = calculateMortgage(inputs);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation error occurred';
      console.error('[MortgageCalculator] Calculation error:', errorMessage);
      setError(errorMessage);
      return buildFallbackCalculation(inputs);
    }
  }, [inputs]);

  const amortizationSchedule = useMemo(() => {
    try {
      if (calculation.monthlyPayment <= 0 || calculation.loanAmount <= 0) return [];
      return generateAmortizationSchedule(
        calculation.loanAmount,
        calculation.interestRate,
        calculation.loanTerm,
        calculation.monthlyPayment
      );
    } catch (err) {
      console.error('[MortgageCalculator] Amortization error:', err);
      return [];
    }
  }, [calculation]);

  const updateInput = useCallback((key: keyof MortgageInputs, value: number) => {
    if (isNaN(value) || !isFinite(value)) {
      console.warn(`[MortgageCalculator] Invalid value for ${key}:`, value);
      return;
    }
    const clampedValue = Math.max(0, value);
    setInputs(prev => {
      // Prevent unnecessary re-renders with strict equality check
      if (prev[key] === clampedValue) return prev;
      return { ...prev, [key]: clampedValue };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setInputs({
      homePrice: 450000,
      downPayment: 90000,
      interestRate: 7.25,
      loanTerm: 30,
      propertyTaxRate: 1.25,
      homeInsuranceRate: 0.35,
      pmiRate: 0.5,
      hoaFees: 0,
    });
    setError(null);
  }, []);

  return {
    inputs,
    calculation,
    amortizationSchedule,
    error,
    updateInput,
    resetToDefaults,
  };
}