import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  gradient?: string[];
  testID?: string;
}

const ResultCard = React.memo<ResultCardProps>(({ 
  title, 
  value, 
  subtitle, 
  gradient = colors.gradient.primary as string[],
  testID 
}) => {
  return (
    <LinearGradient
      colors={gradient as any}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value} testID={testID}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </LinearGradient>
  );
});

ResultCard.displayName = 'ResultCard';

export default ResultCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    marginBottom: spacing[4],
    shadowColor: colors.shadow.lg.shadowColor,
    shadowOffset: colors.shadow.lg.shadowOffset,
    shadowOpacity: colors.shadow.lg.shadowOpacity,
    shadowRadius: colors.shadow.lg.shadowRadius,
    elevation: colors.shadow.lg.elevation,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing[3],
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.black,
    color: colors.text.inverse,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing[2],
    textAlign: 'center',
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
});