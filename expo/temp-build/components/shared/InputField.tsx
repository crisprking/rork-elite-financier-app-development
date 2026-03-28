import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  prefix?: string;
  suffix?: string;
  testID?: string;
}

const InputField = React.memo<InputFieldProps>((
  {
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    prefix,
    suffix,
    testID
  }
) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: themeColors.text.primary }]}>{label}</Text>
      <View style={[styles.inputContainer, { 
        backgroundColor: themeColors.surface.elevated,
        borderColor: themeColors.border.light 
      }]}>
        {prefix && <Text style={[styles.prefix, { color: '#00E67A' }]}>{prefix}</Text>}
        <TextInput
          style={[styles.input, 
            prefix && styles.inputWithPrefix, 
            suffix && styles.inputWithSuffix,
            { color: themeColors.text.primary }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={themeColors.text.tertiary}
          testID={testID}
        />
        {suffix && <Text style={[styles.suffix, { color: '#00E67A' }]}>{suffix}</Text>}
      </View>
    </View>
  );
});

InputField.displayName = 'InputField';

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
    letterSpacing: typography.letterSpacing.wide,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
    height: 64,
    shadowColor: colors.shadow.sm.shadowColor,
    shadowOffset: colors.shadow.sm.shadowOffset,
    shadowOpacity: colors.shadow.sm.shadowOpacity,
    shadowRadius: colors.shadow.sm.shadowRadius,
    elevation: colors.shadow.sm.elevation,
  },
  input: {
    flex: 1,
    fontSize: typography.size.lg,
    paddingVertical: 0,
    fontWeight: typography.weight.medium,
  },
  inputWithPrefix: {
    marginLeft: spacing[2],
  },
  inputWithSuffix: {
    marginRight: spacing[2],
  },
  prefix: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  suffix: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});