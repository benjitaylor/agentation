
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { Card, Button, ListItem } from '../components';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: { userId: string };
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};

export function ProfileScreen({ navigation, route }: ProfileScreenProps) {
  const { userId } = route.params;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
        </View>
        <Text style={styles.userName}>Test User</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeInfo}>userId: {userId}</Text>
        </View>
      </View>

      {/* Stats */}
      <Card title="Stats">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>890</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </Card>

      {/* Profile Info */}
      <Card title="Profile Information">
        <ListItem title="User ID" subtitle={userId} onPress={() => {}} />
        <ListItem title="Full Name" subtitle="Test User" onPress={() => console.log('Edit name')} />
        <ListItem title="Email" subtitle="user@example.com" onPress={() => console.log('Edit email')} />
        <ListItem title="Phone" subtitle="+1 (555) 123-4567" onPress={() => console.log('Edit phone')} />
        <ListItem title="Location" subtitle="San Francisco, CA" onPress={() => console.log('Edit location')} />
      </Card>

      {/* Actions */}
      <Card title="Actions">
        <View style={styles.buttonRow}>
          <Button title="Edit Profile" onPress={() => console.log('Edit profile')} />
          <Button title="Share" onPress={() => console.log('Share')} variant="secondary" />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Log Out" onPress={() => console.log('Logout')} variant="danger" />
        </View>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>@skylarbarrera</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.xl,
    ...shadows.md,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: typography.weights.semibold,
    color: '#fff',
  },
  userName: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
  },
  userEmail: {
    fontSize: typography.sizes.body,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
  },
  routeInfoContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.light.bgSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  routeInfo: {
    fontSize: typography.sizes.caption,
    color: colors.light.textMuted,
    fontFamily: 'Menlo',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
  },
  statLabel: {
    fontSize: typography.sizes.caption,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  // Footer
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: typography.sizes.small,
    color: colors.light.textMuted,
  },
});
