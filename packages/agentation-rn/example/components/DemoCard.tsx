
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography, shadows } from '../theme';

interface DemoCardProps {
  title: string;
  description: string;
}

export function DemoCard({ title, description }: DemoCardProps) {
  return (
    <View style={styles.demoCard}>
      <Text style={styles.demoCardTitle}>{title}</Text>
      <Text style={styles.demoCardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  demoCard: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  demoCardTitle: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  demoCardDescription: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
});
