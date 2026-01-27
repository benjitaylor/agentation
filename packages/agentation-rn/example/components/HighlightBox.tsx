
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface HighlightBoxProps {
  children: React.ReactNode;
}

export function HighlightBox({ children }: HighlightBoxProps) {
  return (
    <View style={styles.highlightBox}>
      <Text style={styles.highlightText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  highlightBox: {
    backgroundColor: colors.light.bgSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  highlightText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 22,
  },
});
