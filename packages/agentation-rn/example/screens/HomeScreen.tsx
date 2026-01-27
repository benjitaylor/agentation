
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../theme';
import {
  Card,
  Button,
  InputField,
  DemoCard,
  SectionHeader,
  Paragraph,
  NumberedList,
  BulletList,
  HighlightBox,
  NoteBox,
  SparkleIcon,
  CopyIcon,
} from '../components';

// =============================================================================
// Types
// =============================================================================

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: { userId: string };
  ScrollExample: undefined;
  ModalExample: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// =============================================================================
// HomeScreen
// =============================================================================

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [demoInput, setDemoInput] = useState('');

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Overview</Text>
        <Text style={styles.tagline}>Point at problems, not code</Text>
      </View>

      {/* Introduction */}
      <Card>
        <Paragraph>
          Agentation (agent + annotation) is a dev tool that lets you annotate
          elements in your app and generate structured feedback for AI coding agents.
        </Paragraph>
        <Paragraph>
          Tap elements, add notes, and paste the output into Claude Code, Cursor,
          or any agent that has access to your codebase. It's fully agent-agnostic,
          so the markdown output works with any AI tool.
        </Paragraph>
        <HighlightBox>
          The key insight: agents can find and fix code much faster when they
          know exactly which element you're referring to. Agentation captures
          component names, file paths, and positions so the agent can locate
          the corresponding source files. Based on agentation.dev by Benji
          Taylor, Dennis Jin, and Alex Vanderzon.
        </HighlightBox>
      </Card>

      {/* Quick Start */}
      <SectionHeader title="Quick start" />
      <Card>
        <View style={styles.quickStartList}>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>1.</Text>
            <View style={styles.quickStartTextRow}>
              <Text style={styles.quickStartText}>Tap the </Text>
              <View style={styles.inlineIcon}><SparkleIcon size={16} /></View>
              <Text style={styles.quickStartText}> icon to activate</Text>
            </View>
          </View>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>2.</Text>
            <Text style={styles.quickStartText}>
              <Text style={styles.bold}>Tap</Text> any element to see its name highlighted
            </Text>
          </View>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>3.</Text>
            <Text style={styles.quickStartText}>
              <Text style={styles.bold}>Long press</Text> to add an annotation
            </Text>
          </View>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>4.</Text>
            <Text style={styles.quickStartText}>
              Write your feedback and tap <Text style={styles.bold}>Save</Text>
            </Text>
          </View>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>5.</Text>
            <View style={styles.quickStartTextRow}>
              <Text style={styles.quickStartText}>Tap </Text>
              <View style={styles.inlineIcon}><CopyIcon size={16} /></View>
              <Text style={styles.quickStartText}> to copy formatted markdown</Text>
            </View>
          </View>
          <View style={styles.quickStartItem}>
            <Text style={styles.quickStartNumber}>6.</Text>
            <Text style={styles.quickStartText}>Paste into your agent</Text>
          </View>
        </View>
      </Card>

      {/* How It Works */}
      <SectionHeader title="How it works with agents" />
      <Card>
        <Paragraph>
          Agentation works best with AI tools that have access to your codebase
          (Claude Code, Cursor, Windsurf, etc.):
        </Paragraph>
        <NumberedList
          items={[
            'You see a bug or want a change in your running app',
            'Use Agentation to annotate the element with your feedback',
            'Copy the output and paste it into your agent',
            'The agent uses the component paths to search your codebase',
            'It finds the relevant component/file and makes the fix',
          ]}
        />
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            Without Agentation:{'\n'}
            "the blue button in the sidebar"{'\n\n'}
            With Agentation:{'\n'}
            components/Button.tsx:42 (Button)
          </Text>
        </View>
      </Card>

      {/* Try It - Demo Section */}
      <SectionHeader title="Try it" />
      <Card>
        <Paragraph>
          The toolbar is active on this screen. Try annotating these demo elements:
        </Paragraph>

        {/* Demo Buttons */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>Button Components</Text>
          <View style={styles.buttonRow}>
            <Button title="Primary" onPress={() => console.log('Primary')} />
            <Button title="Secondary" onPress={() => console.log('Secondary')} variant="secondary" />
            <Button title="Danger" onPress={() => console.log('Danger')} variant="danger" />
          </View>
        </View>

        {/* Demo Input */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>Input Component</Text>
          <InputField
            placeholder="Try selecting this text..."
            value={demoInput}
            onChangeText={setDemoInput}
          />
        </View>

        {/* Demo Cards */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>Card Components</Text>
          <DemoCard
            title="Example Card"
            description="This is a demo card component. Tap it to create an annotation and see the file path."
          />
          <DemoCard
            title="Another Card"
            description="Each component shows its source file location when annotated."
          />
        </View>
      </Card>

      {/* Navigation Examples */}
      <SectionHeader title="Navigation" />
      <Card>
        <Paragraph>
          Agentation detects the current route and includes it in annotation
          output. This helps agents understand which screen an element belongs to.
        </Paragraph>
        <NoteBox>
          Currently supports React Navigation only. Expo Router and other
          navigation libraries are not yet supported.
        </NoteBox>
        <View style={{ marginTop: spacing.md }}>
          <Paragraph>
            Test route detection across different screens:
          </Paragraph>
        </View>
        <View style={styles.buttonRow}>
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
          <Button
            title="Profile"
            onPress={() => navigation.navigate('Profile', { userId: '123' })}
            variant="secondary"
          />
        </View>
      </Card>

      {/* API Examples */}
      <SectionHeader title="Mobile APIs" />
      <Card>
        <Paragraph>
          React Native has constraints that don't exist on web. These APIs help
          Agentation work seamlessly in mobile-specific contexts:
        </Paragraph>
        <HighlightBox>
          useAgentationScroll — Keeps annotation markers positioned correctly
          during scroll. Required because RN scroll events don't bubble like web.
        </HighlightBox>
        <View style={{ marginTop: spacing.md }}>
          <HighlightBox>
            AgenationView — Drop-in annotation layer for modals and nested
            navigators. iOS modals render outside the normal view hierarchy,
            so this provides a separate annotation context.
          </HighlightBox>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <Paragraph>
            Try the examples to see these APIs in action:
          </Paragraph>
        </View>
        <View style={styles.buttonRow}>
          <Button
            title="ScrollView"
            onPress={() => navigation.navigate('ScrollExample')}
          />
          <Button
            title="Modal"
            onPress={() => navigation.navigate('ModalExample')}
            variant="secondary"
          />
        </View>
      </Card>

      {/* Best Practices */}
      <SectionHeader title="Best practices" />
      <Card>
        <BulletList
          items={[
            'Be specific — "Button text unclear" is better than "fix this"',
            'One issue per annotation — easier for the agent to address',
            'Include context — mention what you expected vs. what you see',
            'Use the component path — it helps agents find the right file',
          ]}
        />
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>agentation-rn</Text>
        <Text style={styles.footerMuted}>RN port by @skylarbarrera</Text>
        <Text style={styles.footerMuted}>Original: agentation.dev</Text>
      </View>
    </ScrollView>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },

  // Header
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    letterSpacing: typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: typography.sizes.title,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },

  // Quick Start
  quickStartList: {
    gap: spacing.sm,
  },
  quickStartItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStartNumber: {
    width: 24,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  quickStartText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
  },
  quickStartTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inlineIcon: {
    marginHorizontal: 2,
  },
  bold: {
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
  },

  // Code Block
  codeBlock: {
    backgroundColor: colors.dark.bg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  codeText: {
    fontSize: typography.sizes.caption,
    fontFamily: 'Menlo',
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },

  // Demo Section
  demoSection: {
    marginBottom: spacing.lg,
  },
  demoLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.light.textTertiary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },

  // Footer
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: typography.sizes.caption,
    color: colors.light.textTertiary,
  },
  footerMuted: {
    fontSize: typography.sizes.small,
    color: colors.light.textMuted,
    marginTop: spacing.xs,
  },
});
