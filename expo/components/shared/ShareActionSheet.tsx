import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Animated, Dimensions, PanResponder, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Share as ShareIcon, FileText, Download, X, Crown, GripHorizontal } from 'lucide-react-native';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface ShareActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  hasPremiumAccess: boolean;
  calculatorType: 'mortgage' | 'car-loan';
}

export default function ShareActionSheet({
  visible,
  onClose,
  onShare,
  onExportPDF,
  onExportCSV,
  hasPremiumAccess,
  calculatorType,
}: ShareActionSheetProps) {
  const router = useRouter();
  const calculatorTitle = calculatorType === 'mortgage' ? 'Mortgage' : 'Car Loan';

  const screenHeight = Dimensions.get('window').height;
  const initialSnapPct = 0.45;
  const expandedSnapPct = 0.85;
  const hiddenY = screenHeight;
  const initialY = screenHeight * (1 - initialSnapPct);
  const expandedY = screenHeight * (1 - expandedSnapPct);

  const translateY = useRef<Animated.Value>(new Animated.Value(hiddenY)).current;
  const currentSnap = useRef<'initial' | 'expanded'>('initial');

  useEffect(() => {
    if (visible) {
      translateY.setValue(hiddenY);
      Animated.spring(translateY, { toValue: initialY, useNativeDriver: true, damping: 20, stiffness: 180, mass: 0.9 }).start(() => {
        AccessibilityInfo.announceForAccessibility?.('Share and export menu opened');
      });
    } else {
      Animated.spring(translateY, { toValue: hiddenY, useNativeDriver: true, damping: 25, stiffness: 240, mass: 1 }).start();
    }
  }, [visible, hiddenY, initialY, translateY]);

  const panResponder = useMemo(() => {
    let startY = 0;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((v?: number) => {
          startY = typeof v === 'number' ? v : 0;
        });
      },
      onPanResponderMove: (_e, g) => {
        const next = Math.max(expandedY - 20, Math.min(hiddenY, startY + g.dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const shouldClose = g.vy > 1.4 || (g.dy > 80 && currentSnap.current === 'initial');
        const shouldExpand = g.vy < -0.8 || g.dy < -60;
        if (shouldClose) {
          Animated.spring(translateY, { toValue: hiddenY, useNativeDriver: true, damping: 24, stiffness: 240 }).start(onClose);
          return;
        }
        if (shouldExpand) {
          currentSnap.current = 'expanded';
          Animated.spring(translateY, { toValue: expandedY, useNativeDriver: true, damping: 22, stiffness: 210 }).start();
        } else {
          currentSnap.current = 'initial';
          Animated.spring(translateY, { toValue: initialY, useNativeDriver: true, damping: 22, stiffness: 210 }).start();
        }
      },
    });
  }, [expandedY, hiddenY, initialY, onClose, translateY]);

  const ActionButton = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    isPremium = false,
    gradient 
  }: {
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    title: string;
    subtitle: string;
    onPress: () => void;
    isPremium?: boolean;
    gradient: string[];
  }) => (
    <TouchableOpacity
      testID={`share-sheet-action-${title}`}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      style={[styles.actionButton, !hasPremiumAccess && isPremium && styles.actionButtonDisabled]}
      onPress={hasPremiumAccess || !isPremium ? onPress : undefined}
      disabled={!hasPremiumAccess && isPremium}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={!hasPremiumAccess && isPremium ? ['#E5E5E5', '#D4D4D4'] : (gradient as any)}
        style={styles.actionButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.actionButtonContent}>
          <View style={styles.actionButtonIcon}>
            <Icon 
              size={24} 
              color={!hasPremiumAccess && isPremium ? colors.neutral[400] : colors.text.inverse} 
              strokeWidth={2}
            />
            {isPremium && !hasPremiumAccess && (
              <View style={styles.premiumBadge}>
                <Crown size={12} color={colors.accent.gold} />
              </View>
            )}
          </View>
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonTitle, !hasPremiumAccess && isPremium && styles.actionButtonTitleDisabled]}>
              {title}
            </Text>
            <Text style={[styles.actionButtonSubtitle, !hasPremiumAccess && isPremium && styles.actionButtonSubtitleDisabled]}>
              {subtitle}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity testID="share-sheet-overlay" style={styles.overlayTouchable} onPress={onClose} />

        <Animated.View
          testID="share-sheet"
          style={[styles.container, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={colors.gradient.subtle as any}
            style={styles.containerGradient}
          >
            <View style={styles.grabberArea}>
              <View style={styles.grabber}>
                <GripHorizontal size={16} color={colors.neutral[400]} />
              </View>
            </View>

            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Share & Export</Text>
                <Text style={styles.subtitle}>{calculatorTitle} Calculator Results</Text>
              </View>
              <TouchableOpacity testID="share-sheet-close" onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close share and export menu">
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <ActionButton
                icon={ShareIcon}
                title="Share Results"
                subtitle={Platform.OS === 'web' ? 'Copy to clipboard or share' : 'Share via apps & messages'}
                onPress={() => {
                  onShare();
                  onClose();
                }}
                gradient={colors.gradient.primary as string[]}
              />

              <ActionButton
                icon={FileText}
                title="Export PDF Report"
                subtitle="Professional formatted report"
                onPress={() => {
                  onExportPDF();
                  onClose();
                }}
                isPremium={true}
                gradient={colors.gradient.secondary as string[]}
              />

              <ActionButton
                icon={Download}
                title="Export CSV Data"
                subtitle="Spreadsheet-ready data export"
                onPress={() => {
                  onExportCSV();
                  onClose();
                }}
                isPremium={true}
                gradient={colors.gradient.accent as string[]}
              />
            </View>

            {!hasPremiumAccess && (
              <TouchableOpacity
                testID="share-sheet-upgrade"
                activeOpacity={0.95}
                onPress={() => router.push('/paywall')}
                style={styles.premiumPrompt}
                accessibilityRole="button"
                accessibilityLabel="Upgrade to FinWise Pro for PDF and CSV exports"
              >
                <LinearGradient
                  colors={colors.gradient.luxury as any}
                  style={styles.premiumPromptGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Crown size={20} color={colors.text.inverse} />
                  <Text style={styles.premiumPromptText}>
                    Upgrade to FinWise Pro for PDF & CSV exports
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    overflow: 'hidden',
    shadowColor: colors.shadow.xl.shadowColor,
    shadowOffset: colors.shadow.xl.shadowOffset,
    shadowOpacity: colors.shadow.xl.shadowOpacity,
    shadowRadius: colors.shadow.xl.shadowRadius,
    elevation: colors.shadow.xl.elevation,
    backgroundColor: colors.surface.elevated,
  },
  containerGradient: {
    paddingTop: spacing[2],
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[6],
    paddingHorizontal: spacing[6],
  },
  grabberArea: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  grabber: {
    width: 44,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  closeButton: {
    padding: spacing[2],
    marginTop: -spacing[2],
    marginRight: -spacing[2],
  },
  actions: {
    gap: spacing[3],
  },
  actionButton: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    shadowColor: colors.shadow.md.shadowColor,
    shadowOffset: colors.shadow.md.shadowOffset,
    shadowOpacity: colors.shadow.md.shadowOpacity,
    shadowRadius: colors.shadow.md.shadowRadius,
    elevation: colors.shadow.md.elevation,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    padding: spacing[5],
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.sm.shadowColor,
    shadowOffset: colors.shadow.sm.shadowOffset,
    shadowOpacity: colors.shadow.sm.shadowOpacity,
    shadowRadius: colors.shadow.sm.shadowRadius,
    elevation: colors.shadow.sm.elevation,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.tight,
  },
  actionButtonTitleDisabled: {
    color: colors.neutral[500],
  },
  actionButtonSubtitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: typography.weight.medium,
    lineHeight: typography.lineHeight.snug,
  },
  actionButtonSubtitleDisabled: {
    color: colors.neutral[400],
  },
  premiumPrompt: {
    marginTop: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  premiumPromptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  premiumPromptText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.inverse,
    textAlign: 'center',
  },
});