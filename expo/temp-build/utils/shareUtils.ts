import { Platform, Alert, Share } from 'react-native';
    import { formatCurrency, formatPercent } from './calculations';

    interface MortgageData {
      homePrice: number;
      downPayment: number;
      interestRate: number;
      loanTerm: number;
      monthlyPayment: number;
      totalMonthlyPayment: number;
      totalInterest: number;
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

    interface CarLoanData {
      vehiclePrice: number;
      downPayment: number;
      tradeInValue: number;
      interestRate: number;
      loanTerm: number;
      monthlyPayment: number;
      loanAmount: number;
      totalInterest: number;
      totalCost: number;
      salesTax: number;
      fees: number;
    }

    type CalculatorData = MortgageData | CarLoanData;

    function isMortgageData(data: CalculatorData): data is MortgageData {
      return 'homePrice' in data;
    }

    function isCarLoanData(data: CalculatorData): data is CarLoanData {
      return 'vehiclePrice' in data;
    }

    export const generateShareText = (data: CalculatorData, type: 'mortgage' | 'car-loan'): string => {
      const timestamp = new Date().toLocaleDateString();
      
      if (type === 'mortgage' && isMortgageData(data)) {
        return `🏠 FinSage Mortgage Calculator Results - ${timestamp}

💰 LOAN DETAILS
Home Price: ${formatCurrency(data.homePrice)}
Down Payment: ${formatCurrency(data.downPayment)} (${((data.downPayment / data.homePrice) * 100).toFixed(1)}%)
Loan Amount: ${formatCurrency(data.homePrice - data.downPayment)}
Interest Rate: ${formatPercent(data.interestRate)}
Loan Term: ${data.loanTerm} years

📊 MONTHLY BREAKDOWN
Principal & Interest: ${formatCurrency(data.monthlyPayment)}
Property Tax: ${formatCurrency(data.breakdown.taxes)}
Home Insurance: ${formatCurrency(data.breakdown.insurance)}
${data.breakdown.pmi > 0 ? `PMI: ${formatCurrency(data.breakdown.pmi)}
` : ''}${data.breakdown.hoa > 0 ? `HOA Fees: ${formatCurrency(data.breakdown.hoa)}
` : ''}
💳 TOTAL MONTHLY: ${formatCurrency(data.totalMonthlyPayment)}

🎯 SUMMARY
Total Interest: ${formatCurrency(data.totalInterest)}
Loan-to-Value: ${data.loanToValue.toFixed(1)}%
${data.loanToValue > 80 ? '⚠️ PMI Required' : '✅ No PMI Required'}

Calculated with FinSage
📱 Get FinSage on the App Store`;
      }
      
      if (type === 'car-loan' && isCarLoanData(data)) {
        return `🚗 FinSage Car Loan Calculator Results - ${timestamp}

💰 VEHICLE DETAILS
Vehicle Price: ${formatCurrency(data.vehiclePrice)}
Down Payment: ${formatCurrency(data.downPayment)}
Trade-in Value: ${formatCurrency(data.tradeInValue)}
Sales Tax: ${formatCurrency(data.salesTax)}
Fees: ${formatCurrency(data.fees)}

📊 LOAN TERMS
Amount Financed: ${formatCurrency(data.loanAmount)}
Interest Rate: ${formatPercent(data.interestRate)}
Loan Term: ${data.loanTerm} years

💳 PAYMENT INFO
Monthly Payment: ${formatCurrency(data.monthlyPayment)}
Total Interest: ${formatCurrency(data.totalInterest)}
Total Cost: ${formatCurrency(data.totalCost)}

Calculated with FinSage
📱 Get FinSage on the App Store`;
      }
      
      return 'FinWise Calculator Results';
    };

    export const generateCSVData = (data: CalculatorData, type: 'mortgage' | 'car-loan'): string => {
      const timestamp = new Date().toISOString();
      
      if (type === 'mortgage' && isMortgageData(data)) {
        return `FinSage Mortgage Calculator Export,${timestamp}

Loan Details
Home Price,${data.homePrice}
Down Payment,${data.downPayment}
Loan Amount,${data.homePrice - data.downPayment}
Interest Rate,${data.interestRate}%
Loan Term,${data.loanTerm} years

Monthly Breakdown
Principal & Interest,${data.monthlyPayment}
Property Tax,${data.breakdown.taxes}
Home Insurance,${data.breakdown.insurance}
PMI,${data.breakdown.pmi}
HOA Fees,${data.breakdown.hoa}
Total Monthly Payment,${data.totalMonthlyPayment}

Summary
Total Interest,${data.totalInterest}
Loan-to-Value Ratio,${data.loanToValue}%
PMI Required,${data.loanToValue > 80 ? 'Yes' : 'No'}`;
      }
      
      if (type === 'car-loan' && isCarLoanData(data)) {
        return `FinSage Car Loan Calculator Export,${timestamp}

Vehicle Details
Vehicle Price,${data.vehiclePrice}
Down Payment,${data.downPayment}
Trade-in Value,${data.tradeInValue}
Sales Tax,${data.salesTax}
Fees,${data.fees}

Loan Terms
Amount Financed,${data.loanAmount}
Interest Rate,${data.interestRate}%
Loan Term,${data.loanTerm} years

Payment Information
Monthly Payment,${data.monthlyPayment}
Total Interest,${data.totalInterest}
Total Cost,${data.totalCost}`;
      }
      
      return 'FinWise Calculator Export';
    };

    export const shareResults = async (data: CalculatorData, type: 'mortgage' | 'car-loan'): Promise<void> => {
      try {
        const shareText = generateShareText(data, type);
        
        if (Platform.OS === 'web') {
          try {
            const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;
            if (canNativeShare) {
              // Some browsers throw NotAllowedError if not from a trusted gesture or in insecure context
              await (navigator as any).share({
                title: `FinSage ${type === 'mortgage' ? 'Mortgage' : 'Car Loan'} Calculator Results`,
                text: shareText,
              });
            } else {
              await navigator.clipboard.writeText(shareText);
              Alert.alert('Copied!', 'Results copied to clipboard');
            }
          } catch (err: any) {
            console.warn('Web Share failed, falling back to clipboard:', err?.name || err);
            try {
              await navigator.clipboard.writeText(shareText);
              Alert.alert('Copied!', 'Results copied to clipboard');
            } catch (clipErr) {
              Alert.alert('Share Unavailable', 'Your browser blocked sharing. Please press Cmd/Ctrl+C to copy.');
            }
          }
        } else {
          // Native sharing
          const result = await Share.share({
            message: shareText,
            title: `FinSage ${type === 'mortgage' ? 'Mortgage' : 'Car Loan'} Calculator Results`,
          });
          
          if (result.action === Share.sharedAction) {
            console.log('Results shared successfully');
          }
        }
      } catch (error) {
        console.error('Error sharing results:', error);
        Alert.alert('Share Error', 'Unable to share results. Please try again.');
      }
    };

    export const exportToPDF = async (data: CalculatorData, type: 'mortgage' | 'car-loan'): Promise<void> => {
      try {
        // For now, we'll create a formatted text export that can be saved as PDF
        const pdfContent = generatePDFContent(data, type);
        
        if (Platform.OS === 'web') {
          // Create a blob and download
          const blob = new Blob([pdfContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finsage-${type}-calculator-${Date.now()}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          Alert.alert('Export Complete', 'Results exported successfully!');
        } else {
          // On mobile, share the formatted content
          await Share.share({
            message: pdfContent,
            title: `FinSage ${type === 'mortgage' ? 'Mortgage' : 'Car Loan'} Calculator Export`,
          });
        }
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        Alert.alert('Export Error', 'Unable to export results. Please try again.');
      }
    };

    export const exportToCSV = async (data: CalculatorData, type: 'mortgage' | 'car-loan'): Promise<void> => {
      try {
        const csvContent = generateCSVData(data, type);
        
        if (Platform.OS === 'web') {
          // Create a blob and download
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finsage-${type}-calculator-${Date.now()}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          Alert.alert('Export Complete', 'CSV exported successfully!');
        } else {
          // On mobile, share the CSV content
          await Share.share({
            message: csvContent,
            title: `FinSage ${type === 'mortgage' ? 'Mortgage' : 'Car Loan'} Calculator CSV Export`,
          });
        }
      } catch (error) {
        console.error('Error exporting to CSV:', error);
        Alert.alert('Export Error', 'Unable to export CSV. Please try again.');
      }
    };

    const generatePDFContent = (data: CalculatorData, type: 'mortgage' | 'car-loan'): string => {
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      if (type === 'mortgage' && isMortgageData(data)) {
        return `FINSAGE MORTGAGE CALCULATOR REPORT
Generated: ${timestamp}

${'='.repeat(50)}
LOAN DETAILS
${'='.repeat(50)}

Home Price: ${formatCurrency(data.homePrice)}
Down Payment: ${formatCurrency(data.downPayment)} (${((data.downPayment / data.homePrice) * 100).toFixed(1)}%)
Loan Amount: ${formatCurrency(data.homePrice - data.downPayment)}
Interest Rate: ${formatPercent(data.interestRate)}
Loan Term: ${data.loanTerm} years

${'='.repeat(50)}
MONTHLY PAYMENT BREAKDOWN
${'='.repeat(50)}

Principal & Interest: ${formatCurrency(data.monthlyPayment)}
Property Tax: ${formatCurrency(data.breakdown.taxes)}
Home Insurance: ${formatCurrency(data.breakdown.insurance)}
${data.breakdown.pmi > 0 ? `PMI: ${formatCurrency(data.breakdown.pmi)}
` : ''}${data.breakdown.hoa > 0 ? `HOA Fees: ${formatCurrency(data.breakdown.hoa)}
` : ''}
TOTAL MONTHLY PAYMENT: ${formatCurrency(data.totalMonthlyPayment)}

${'='.repeat(50)}
LOAN SUMMARY
${'='.repeat(50)}

Total Interest Over Life of Loan: ${formatCurrency(data.totalInterest)}
Loan-to-Value Ratio: ${data.loanToValue.toFixed(1)}%
PMI Status: ${data.loanToValue > 80 ? 'Required' : 'Not Required'}

Total Amount Paid: ${formatCurrency((data.monthlyPayment * data.loanTerm * 12) + data.downPayment)}

${'='.repeat(50)}
Generated by FinSage
Download FinWise from the App Store for more features
${'='.repeat(50)}`;
      }
      
      if (type === 'car-loan' && isCarLoanData(data)) {
        return `FINSAGE CAR LOAN CALCULATOR REPORT
Generated: ${timestamp}

${'='.repeat(50)}
VEHICLE DETAILS
${'='.repeat(50)}

Vehicle Price: ${formatCurrency(data.vehiclePrice)}
Down Payment: ${formatCurrency(data.downPayment)}
Trade-in Value: ${formatCurrency(data.tradeInValue)}
Sales Tax: ${formatCurrency(data.salesTax)}
Fees & Documentation: ${formatCurrency(data.fees)}

${'='.repeat(50)}
LOAN TERMS
${'='.repeat(50)}

Amount Financed: ${formatCurrency(data.loanAmount)}
Interest Rate: ${formatPercent(data.interestRate)}
Loan Term: ${data.loanTerm} years

${'='.repeat(50)}
PAYMENT INFORMATION
${'='.repeat(50)}

Monthly Payment: ${formatCurrency(data.monthlyPayment)}
Total Interest: ${formatCurrency(data.totalInterest)}
Total of Payments: ${formatCurrency(data.monthlyPayment * data.loanTerm * 12)}
Total Cost (Vehicle + Interest + Tax + Fees): ${formatCurrency(data.totalCost)}

${'='.repeat(50)}
Generated by FinSage
Download FinWise from the App Store for more features
${'='.repeat(50)}`;
      }
      
      return 'FinWise Calculator Report';
    };