import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import type { AnnotationPopupProps } from '../types';
import { PendingMarker } from './AnnotationMarker';
import { TIMING } from '../utils/animations';

const THEME = {
  dark: {
    background: '#1a1a1a',
    backgroundLight: 'rgba(255, 255, 255, 0.05)',
    backgroundQuote: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.15)',
    popupBorder: 'rgba(255, 255, 255, 0.08)',
    text: '#fff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textDim: 'rgba(255, 255, 255, 0.35)',
    textQuote: 'rgba(255, 255, 255, 0.6)',
    cancelText: 'rgba(255, 255, 255, 0.5)',
    danger: '#ff3b30',
    shadowOpacity: 0.3,
    overlayBg: 'rgba(0, 0, 0, 0.4)',
  },
  light: {
    background: '#FFFFFF',
    backgroundLight: 'rgba(0, 0, 0, 0.03)',
    backgroundQuote: 'rgba(0, 0, 0, 0.04)',
    border: 'rgba(0, 0, 0, 0.12)',
    popupBorder: 'rgba(0, 0, 0, 0.06)',
    text: '#1a1a1a',
    textMuted: 'rgba(0, 0, 0, 0.6)',
    textDim: 'rgba(0, 0, 0, 0.4)',
    textQuote: 'rgba(0, 0, 0, 0.55)',
    cancelText: 'rgba(0, 0, 0, 0.5)',
    danger: '#ff3b30',
    shadowOpacity: 0.12,
    overlayBg: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

interface ExtendedPopupProps extends AnnotationPopupProps {
  detectedElement?: string;
  toolbarHeight?: number;
  settingsMenuHeight?: number;
  accentColor?: string;
  isDarkMode?: boolean;
}

export function AnnotationPopup(props: ExtendedPopupProps) {
  const { annotation, position, visible, onSave, onCancel, onDelete, detectedElement, toolbarHeight = 80, settingsMenuHeight = 0, accentColor = '#3c82f7', isDarkMode = true } = props;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const theme = useMemo(() => THEME[isDarkMode ? 'dark' : 'light'], [isDarkMode]);

  const [comment, setComment] = useState(annotation?.comment || '');
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(4)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setComment(annotation?.comment || '');
  }, [annotation]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: TIMING.normal,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: TIMING.normal,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: TIMING.normal,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      scaleAnim.setValue(0.95);
      translateYAnim.setValue(4);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, translateYAnim, opacityAnim]);

  const handleSave = useCallback(() => {
    if (comment.trim()) {
      Keyboard.dismiss();
      onSave(comment.trim());
      setComment('');
    }
  }, [comment, onSave]);

  const handleCancel = useCallback(() => {
    Keyboard.dismiss();
    onCancel();
    setComment('');
  }, [onCancel]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      Keyboard.dismiss();
      onDelete();
      setComment('');
    }
  }, [onDelete]);

  if (!visible) {
    return null;
  }

  const popupWidth = 280;
  const popupHeight = 150;
  const markerSize = 32;
  const spacing = 8;

  // 1. Horizontal position (center on marker, clamp to edges)
  const popupX = Math.min(
    Math.max(position.x - popupWidth / 2, 16),
    screenWidth - popupWidth - 16
  );

  // 2. Calculate zones
  const safeTop = 60; // Status bar + safe area
  const markerTop = position.y - markerSize / 2;
  const markerBottom = position.y + markerSize / 2;

  // Where does the blocked area start? (keyboard, settings, or toolbar)
  // Toolbar is ALWAYS at bottom, settings menu appears above it when open
  // Settings menu has 8px margin below it (between it and toolbar)
  let blockedAreaTop: number;
  if (keyboardHeight > 0) {
    blockedAreaTop = screenHeight - keyboardHeight;
  } else if (settingsMenuHeight > 0) {
    // Settings menu open - just use toolbar height, the popup will be above settings
    blockedAreaTop = screenHeight - toolbarHeight - settingsMenuHeight;
  } else {
    // Settings closed - popup must stay above toolbar
    blockedAreaTop = screenHeight - toolbarHeight;
  }


  // 3. Try to position below marker (preferred)
  const belowY = markerBottom + spacing;
  const belowFits = (belowY + popupHeight) <= blockedAreaTop;

  // 4. Try to position above marker (tighter spacing when above)
  const aboveY = markerTop - 4 - popupHeight;
  const aboveFits = aboveY >= safeTop && (aboveY + popupHeight + spacing) <= blockedAreaTop;

  // 5. Decide position
  let popupY: number;
  if (belowFits) {
    popupY = belowY;
  } else if (aboveFits) {
    popupY = aboveY;
  } else {
    // Fallback: position directly above blocked area
    popupY = Math.max(safeTop, blockedAreaTop - popupHeight);
  }

  const elementName = annotation?.element || detectedElement || 'Component';
  const selectedText = annotation?.selectedText;
  const isEditMode = !!annotation?.id;
  const submitLabel = isEditMode ? 'Save' : 'Add';

  return (
    <>
      <Pressable
        style={[styles.overlay, { backgroundColor: theme.overlayBg }]}
        onPress={handleCancel}
      />

      {!isEditMode && (
        <PendingMarker x={position.x} y={position.y} color={accentColor} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        pointerEvents="box-none"
      >
        <View
          style={{
            position: 'absolute',
            left: popupX,
            top: popupY,
            width: 280,
          }}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.popup,
              {
                backgroundColor: theme.background,
                borderColor: theme.popupBorder,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
              },
              Platform.select({
                ios: { shadowOpacity: theme.shadowOpacity },
              }),
            ]}
          >
          <View style={styles.header}>
            <Text style={[styles.elementName, { color: theme.textMuted }]} numberOfLines={1}>
              {elementName}
            </Text>
          </View>

          {selectedText && (
            <View style={[styles.quote, { backgroundColor: theme.backgroundQuote }]}>
              <Text style={[styles.quoteText, { color: theme.textQuote }]} numberOfLines={3}>
                &ldquo;{selectedText.slice(0, 80)}
                {selectedText.length > 80 ? '...' : ''}&rdquo;
              </Text>
            </View>
          )}

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundLight,
                borderColor: theme.border,
                color: theme.text,
              },
              isFocused && { borderColor: accentColor },
            ]}
            value={comment}
            onChangeText={setComment}
            placeholder="What should change?"
            placeholderTextColor={theme.textDim}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSave}
            blurOnSubmit={false}
          />

          <View style={styles.actions}>
            {isEditMode && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.deleteButtonText, { color: theme.danger }]}>Delete</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionsSpacer} />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: theme.cancelText }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: accentColor },
                !comment.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!comment.trim()}
            >
              <Text style={styles.submitButtonText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  keyboardAvoid: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  popup: {
    position: 'absolute',
    width: 280,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
    borderWidth: 1,
  },

  header: {
    marginBottom: 8,
  },
  elementName: {
    fontSize: 12,
    fontWeight: '500',
  },

  quote: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    minHeight: 56,
    maxHeight: 120,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 8,
  },

  actionsSpacer: {
    flex: 1,
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },

  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },

  submitButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
});
