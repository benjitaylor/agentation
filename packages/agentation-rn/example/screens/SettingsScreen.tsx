
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme';
import { Card, ListItem, ToggleRow } from '../components';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: { userId: string };
};

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Preferences */}
      <Card title="Preferences">
        <ToggleRow
          label="Push Notifications"
          description="Receive alerts and updates"
          value={notifications}
          onValueChange={setNotifications}
        />
        <ToggleRow
          label="Dark Mode"
          description="Use dark theme"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <ToggleRow
          label="Analytics"
          description="Help improve the app"
          value={analytics}
          onValueChange={setAnalytics}
        />
        <ToggleRow
          label="Biometrics"
          description="Use Face ID / Touch ID"
          value={biometrics}
          onValueChange={setBiometrics}
        />
      </Card>

      {/* Account */}
      <Card title="Account">
        <ListItem
          title="Profile"
          subtitle="View and edit your profile"
          onPress={() => navigation.navigate('Profile', { userId: '123' })}
        />
        <ListItem
          title="Security"
          subtitle="Password and authentication"
          onPress={() => console.log('Security')}
        />
        <ListItem
          title="Privacy"
          subtitle="Data and permissions"
          onPress={() => console.log('Privacy')}
        />
      </Card>

      {/* About */}
      <Card title="About">
        <ListItem
          title="Version"
          subtitle="1.0.0 (Build 1)"
          onPress={() => {}}
        />
        <ListItem
          title="Terms of Service"
          subtitle="Read our terms"
          onPress={() => console.log('Terms')}
        />
        <ListItem
          title="Privacy Policy"
          subtitle="How we handle your data"
          onPress={() => console.log('Privacy Policy')}
        />
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
