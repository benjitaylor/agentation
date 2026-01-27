
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ParagraphProps {
  children: React.ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
});
