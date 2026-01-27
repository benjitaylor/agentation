
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

export function ListItem({
  title,
  subtitle,
  onPress,
  showChevron = true,
}: ListItemProps) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && <Text style={styles.listItemChevron}>›</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.light.text,
  },
  listItemSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.light.textTertiary,
    marginTop: 2,
  },
  listItemChevron: {
    fontSize: 20,
    color: colors.light.textMuted,
  },
});
