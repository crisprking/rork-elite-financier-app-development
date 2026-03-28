import { useState, useMemo, useCallback } from 'react';
import { CarLoanInputs } from '@/types/financial';
import { calculateCarLoan, generateAmortizationSchedule } from '@/utils/calculations';

export function useCarLoanCalculator() {
  const [inputs, setInputs] = useState<CarLoanInputs>({
    vehiclePrice: 42000,
    downPayment: 8400,
    tradeInValue: 0,
    interestRate: 6.75,
    loanTerm: 5,
    salesTaxRate: 8.25,
    fees: 1200,
  });

  const [error, setError] = useState<string | null>(null);

  const calculation = useMemo(() => {
    try {
      const result = calculateCarLoan(inputs);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation error occurred';
      console.error('[CarLoanCalculator] Calculation error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [inputs]);

  const amortizationSchedule = useMemo(() => {
    if (!calculation || calculation.loanAmount <= 0) return [];
    try {
      return generateAmortizationSchedule(
        calculation.loanAmount,
        calculation.interestRate,
        calculation.loanTerm,
        calculation.monthlyPayment
      );
    } catch (err) {
      console.error('[CarLoanCalculator] Amortization error:', err);
      return [];
    }
  }, [calculation]);

  const updateInput = useCallback((key: keyof CarLoanInputs, value: number) => {
    if (isNaN(value) || !isFinite(value)) {
      console.warn(`[CarLoanCalculator] Invalid value for ${key}:`, value);
      return;
    }
    const clampedValue = Math.max(0, value);
    setInputs(prev => {
      if (prev[key] === clampedValue) return prev;
      return { ...prev, [key]: clampedValue };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setInputs({
      vehiclePrice: 42000,
      downPayment: 8400,
      tradeInValue: 0,
      interestRate: 6.75,
      loanTerm: 5,
      salesTaxRate: 8.25,
      fees: 1200,
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