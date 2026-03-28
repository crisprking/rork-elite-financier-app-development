import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import PlatformSlider from '@/components/shared/PlatformSlider';
import { typography, spacing, borderRadius } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface SliderInputProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  formatValue?: (value: number) => string;
  testID?: string;
  premium?: boolean;
  unit?: string;
}

const SliderInput = React.memo<SliderInputProps>(({
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  formatValue = (val) => val.toString(),
  testID,
  unit,
}) => {
  const { colors: themeColors, isDark } = useTheme();
  const [textValue, setTextValue] = useState<string>(String(value));
  const lastPropValue = useRef<number>(value);

  useEffect(() => {
    if (lastPropValue.current !== value) {
      lastPropValue.current = value;
      setTextValue(String(value));
    }
  }, [value]);

  const clamp = useCallback((v: number) => {
    const clamped = Math.max(minimumValue, Math.min(v, maximumValue));
    if (step > 0) {
      const steps = Math.round((clamped - minimumValue) / step);
      return minimumValue + steps * step;
    }
    return clamped;
  }, [minimumValue, maximumValue, step]);

  const commitText = useCallback(() => {
    const cleaned = textValue.replace(/[^0-9.\-]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && isFinite(parsed)) {
      const next = clamp(parsed);
      onValueChange(next);
      setTextValue(String(next));
    } else {
      setTextValue(String(value));
    }
  }, [textValue, clamp, onValueChange, value]);

  const decrement = useCallback(() => {
    const next = clamp(value - step);
    onValueChange(next);
  }, [value, step, clamp, onValueChange]);

  const increment = useCallback(() => {
    const next = clamp(value + step);
    onValueChange(next);
  }, [value, step, clamp, onValueChange]);

  const keyboardType: 'numeric' | 'decimal-pad' = useMemo(() => (String(step).includes('.') ? 'decimal-pad' : 'numeric'), [step]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(26, 26, 26, 0.8)' : 'rgba(248, 250, 252, 0.8)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
        }
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityHint="Swipe left or right to adjust, tap +/- buttons, or tap the value to type precisely"
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: themeColors.text.primary }]}>{label}</Text>
        <View style={styles.inputInline}>
          <TouchableOpacity 
            onPress={decrement} 
            accessibilityLabel="decrease" 
            testID={testID ? `${testID}-dec` : undefined}
            style={[styles.stepperButton, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
            }]}
          >
            <Text style={[styles.stepper, { color: themeColors.text.secondary }]}>–</Text>
          </TouchableOpacity>
          <View style={[styles.valueContainer, {
            backgroundColor: isDark ? 'rgba(0, 230, 122, 0.08)' : 'rgba(0, 230, 122, 0.05)',
            borderColor: isDark ? 'rgba(0, 230, 122, 0.4)' : 'rgba(0, 230, 122, 0.3)'
          }]}>
            <TextInput
              style={[styles.valueInput, { color: themeColors.text.accent }]}
              value={textValue}
              onChangeText={setTextValue}
              onBlur={commitText}
              onSubmitEditing={commitText}
              keyboardType={keyboardType}
              returnKeyType="done"
              testID={testID ? `${testID}-input` : undefined}
              accessibilityLabel={`${label} precise value`}
              placeholder={formatValue(value)}
              placeholderTextColor={isDark ? 'rgba(0, 230, 122, 0.5)' : 'rgba(0, 230, 122, 0.6)'}
            />
            {unit && (
              <Text style={[styles.unit, { color: themeColors.text.tertiary }]}>{unit}</Text>
            )}
          </View>
          <TouchableOpacity 
            onPress={increment} 
            accessibilityLabel="increase" 
            testID={testID ? `${testID}-inc` : undefined}
            style={[styles.stepperButton, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
            }]}
          >
            <Text style={[styles.stepper, { color: themeColors.text.secondary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <PlatformSlider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#00E67A"
        maximumTrackTintColor={isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}
        thumbTintColor="#00E67A"
        testID={testID}
      />
      <View style={styles.range}>
        <Text style={[styles.rangeText, { color: themeColors.text.tertiary }]}>{formatValue(minimumValue)}</Text>
        <Text style={[styles.rangeText, { color: themeColors.text.tertiary }]}>{formatValue(maximumValue)}</Text>
      </View>
    </View>
  );
});

SliderInput.displayName = 'SliderInput';

export default SliderInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
    padding: spacing[6],
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  inputInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: 'center',
  },
  valueInput: {
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.normal,
    flex: 1,
    minWidth: 60,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: typography.weight.bold,
  },
  unit: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    opacity: 0.7,
  },
  slider: {
    height: 60,
    marginHorizontal: -spacing[1],
    marginVertical: spacing[2],
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  rangeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.regular,
  },
});