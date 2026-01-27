
import React from 'react';
import { View, Text, ScrollView, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useAgentationScroll } from 'agentation-rn';
import { colors, spacing, radius, typography, shadows } from '../theme';

export function ScrollExampleScreen() {
  // Hook returns onScroll and scrollEventThrottle for ScrollView
  // Gracefully no-ops in production or if Agentation not available
  const { onScroll, scrollEventThrottle } = useAgentationScroll();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      onScroll={onScroll as any}
      scrollEventThrottle={scrollEventThrottle}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Scroll Example</Text>
        <Text style={styles.subtitle}>
          Annotations adjust position as you scroll
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>useAgentationScroll</Text>
        <Text style={styles.infoText}>
          This hook provides scroll tracking for annotation positioning.
          Markers stay anchored to content as you scroll.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`const { onScroll, scrollEventThrottle } = useAgentationScroll();`}
          </Text>
        </View>
      </View>

      {/* Generate cards to scroll through */}
      {Array.from({ length: 15 }, (_, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>Card {i + 1}</Text>
          <Text style={styles.cardText}>
            Tap anywhere to create an annotation. The marker will stay
            anchored to this content as you scroll up and down.
          </Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>End of list</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  infoTitle: {
    fontSize: typography.sizes.ui,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  codeBlock: {
    backgroundColor: colors.light.bgSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  codeText: {
    fontSize: typography.sizes.caption,
    fontFamily: 'Menlo',
    color: colors.light.text,
  },

  // Cards
  card: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.caption,
    color: colors.light.textMuted,
  },
});
