
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface NoteBoxProps {
  children: React.ReactNode;
}

export function NoteBox({ children }: NoteBoxProps) {
  return (
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noteBox: {
    backgroundColor: colors.light.bgSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.light.textMuted,
  },
  noteText: {
    fontSize: typography.sizes.caption,
    color: colors.light.textTertiary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
