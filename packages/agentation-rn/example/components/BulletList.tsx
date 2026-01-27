
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface BulletListProps {
  items: string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bulletList: {
    marginBottom: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  bulletDot: {
    width: 20,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
});
