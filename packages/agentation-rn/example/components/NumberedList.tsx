
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface NumberedListProps {
  items: string[];
}

export function NumberedList({ items }: NumberedListProps) {
  return (
    <View style={styles.numberedList}>
      {items.map((item, index) => (
        <View key={index} style={styles.numberedItem}>
          <Text style={styles.numberedNumber}>{index + 1}.</Text>
          <Text style={styles.numberedText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  numberedList: {
    marginBottom: spacing.sm,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  numberedNumber: {
    width: 24,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  numberedText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
});
