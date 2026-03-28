import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface PaymentBreakdownProps {
  breakdown: {
    principal: number;
    interest: number;
    taxes?: number;
    insurance?: number;
    pmi?: number;
    hoa?: number;
  };
  total: number;
}

const { width } = Dimensions.get('window');
const chartSize = Math.min(width - 80, 280);
const radius = chartSize / 2 - 40;
const circumference = 2 * Math.PI * radius;

const PaymentBreakdown = React.memo<PaymentBreakdownProps>(({ breakdown, total }) => {
  const { colors: themeColors } = useTheme();
  
  const segments = [
    { label: 'Principal', value: breakdown.principal, color: '#00E67A' },
    { label: 'Interest', value: breakdown.interest, color: '#F59E0B' },
    ...(breakdown.taxes ? [{ label: 'Taxes', value: breakdown.taxes, color: '#10B981' }] : []),
    ...(breakdown.insurance ? [{ label: 'Insurance', value: breakdown.insurance, color: '#8B5CF6' }] : []),
    ...(breakdown.pmi ? [{ label: 'PMI', value: breakdown.pmi, color: '#EF4444' }] : []),
    ...(breakdown.hoa ? [{ label: 'HOA', value: breakdown.hoa, color: '#F97316' }] : []),
  ];

  let cumulativePercentage = 0;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface.elevated }]}>
      <Text style={[styles.title, { color: themeColors.text.primary }]}>Payment Breakdown</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize}>
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += percentage;
            
            return (
              <Circle
                key={index}
                cx={chartSize / 2}
                cy={chartSize / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={20}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}
              />
            );
          })}
        </Svg>
        
        <View style={styles.centerText}>
          <Text style={[styles.totalLabel, { color: themeColors.text.secondary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: themeColors.text.primary }]}>
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
            <Text style={[styles.legendLabel, { color: themeColors.text.primary }]}>{segment.label}</Text>
            <Text style={[styles.legendValue, { color: themeColors.text.primary }]}>
              ${segment.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

PaymentBreakdown.displayName = 'PaymentBreakdown';

export default PaymentBreakdown;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    marginBottom: spacing[6],
    shadowColor: colors.shadow.md.shadowColor,
    shadowOffset: colors.shadow.md.shadowOffset,
    shadowOpacity: colors.shadow.md.shadowOpacity,
    shadowRadius: colors.shadow.md.shadowRadius,
    elevation: colors.shadow.md.elevation,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginBottom: spacing[6],
    letterSpacing: typography.letterSpacing.tight,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
  },
  legend: {
    gap: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.base,
    marginRight: spacing[3],
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  legendValue: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
});