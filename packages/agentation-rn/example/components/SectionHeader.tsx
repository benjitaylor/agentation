
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    letterSpacing: typography.letterSpacing.tight,
  },
});
