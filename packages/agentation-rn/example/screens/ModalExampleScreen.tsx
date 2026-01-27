
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { AgenationView } from 'agentation-rn';
import { colors, spacing, radius, typography, shadows } from '../theme';

export function ModalExampleScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Modal Example</Text>
          <Text style={styles.subtitle}>
            AgenationView enables annotations inside modals
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>AgenationView</Text>
          <Text style={styles.infoText}>
            The main Agentation wrapper can't reach inside native modals.
            Use AgenationView to enable annotations in any context.
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`<Modal>\n  <AgenationView>\n    <Content />\n  </AgenationView>\n</Modal>`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Open Modal</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Wrap modal content with AgenationView for annotation support */}
        <AgenationView style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modal with Annotations</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                This modal is wrapped with AgenationView. Tap anywhere to
                create annotations - even inside the modal!
              </Text>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Feature Card</Text>
                <Text style={styles.cardText}>
                  Tap this card to annotate it. The annotation will be
                  local to this modal's AgenationView context.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Another Card</Text>
                <Text style={styles.cardText}>
                  Each AgenationView maintains its own annotation state.
                  Great for forms, sheets, and overlays.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Toolbar Included</Text>
                <Text style={styles.cardText}>
                  AgenationView includes its own toolbar (FAB). Toggle
                  annotation mode, copy to clipboard, or clear all.
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </AgenationView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  infoTitle: {
    fontSize: typography.sizes.ui,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  codeBlock: {
    backgroundColor: colors.light.bgSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  codeText: {
    fontSize: typography.sizes.caption,
    fontFamily: 'Menlo',
    color: colors.light.text,
    lineHeight: 18,
  },

  // Button
  button: {
    backgroundColor: colors.light.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.sizes.ui,
    fontWeight: typography.weights.medium,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.bgCard,
  },
  modalTitle: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
  },
  closeButton: {
    fontSize: typography.sizes.ui,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  modalBody: {
    flex: 1,
    padding: spacing.lg,
  },
  modalText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  // Cards in modal
  card: {
    backgroundColor: colors.light.bgCard,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: typography.sizes.ui,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: typography.sizes.body,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
});
