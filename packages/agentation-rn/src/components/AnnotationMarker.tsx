import { useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import type { AnnotationMarkerProps, Annotation } from '../types';
import { TIMING } from '../utils/animations';

interface MarkerProps extends Omit<AnnotationMarkerProps, 'annotation' | 'index' | 'onPress'> {
  annotation?: Annotation;
  index?: number;
  isPending?: boolean;
  x: number;
  y: number;
  onPress?: () => void;
  onLongPress?: () => void;
  onEdit?: (annotation: Annotation) => void;
  onDelete?: (id: string) => void;
  scrollOffset?: { x: number; y: number };
  isEditing?: boolean;
  skipEntryAnimation?: boolean;
  color?: string;
  isRemoving?: boolean;
  onRemoveComplete?: () => void;
}

export const AnnotationMarker = memo(function AnnotationMarker(props: (AnnotationMarkerProps & {
  scrollOffset?: { x: number; y: number };
  onEdit?: (annotation: Annotation) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  skipEntryAnimation?: boolean;
  color?: string;
  isRemoving?: boolean;
  onRemoveComplete?: () => void;
}) | MarkerProps) {
  const { isSelected, onPress } = props;
  const onLongPress = 'onLongPress' in props ? props.onLongPress : undefined;

  const isPending = 'isPending' in props ? props.isPending : false;
  const x = 'x' in props ? props.x : props.annotation.x;
  const y = 'y' in props ? props.y : props.annotation.y;
  const index = 'index' in props ? props.index : undefined;
  const scrollOffset = 'scrollOffset' in props ? props.scrollOffset : { x: 0, y: 0 };
  const annotation = 'annotation' in props ? props.annotation : undefined;
  const onEdit = 'onEdit' in props ? props.onEdit : undefined;
  const onDelete = 'onDelete' in props ? props.onDelete : undefined;
  const skipEntryAnimation = 'skipEntryAnimation' in props ? props.skipEntryAnimation : false;
  const color = 'color' in props ? props.color : '#3c82f7';
  const isRemoving = 'isRemoving' in props ? props.isRemoving : false;
  const onRemoveComplete = 'onRemoveComplete' in props ? props.onRemoveComplete : undefined;

  const markerSize = 22;

  const opacityAnim = useRef(new Animated.Value(skipEntryAnimation ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(skipEntryAnimation ? 1 : 0.3)).current;

  useEffect(() => {
    if (skipEntryAnimation) return;

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: TIMING.entrance,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: TIMING.entrance,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim, skipEntryAnimation]);

  useEffect(() => {
    if (isRemoving) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: TIMING.exit,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: TIMING.exit,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onRemoveComplete?.();
      });
    }
  }, [isRemoving, opacityAnim, scaleAnim, onRemoveComplete]);

  const adjustedX = x - (scrollOffset?.x || 0);
  const adjustedY = y - (scrollOffset?.y || 0);

  const handleEdit = () => {
    if (annotation && onEdit) {
      onEdit(annotation);
    }
  };

  const handleDelete = () => {
    if (annotation && onDelete) {
      onDelete(annotation.id);
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
      return;
    }

    if (!annotation) return;

    const commentPreview = annotation.comment.length > 50
      ? annotation.comment.substring(0, 50) + '...'
      : annotation.comment;

    if (Platform.OS === 'ios') {
      const options = ['Cancel'];
      const destructiveIndex = onDelete ? options.length : undefined;
      if (onDelete) options.push('Delete');
      if (onEdit) options.push('Edit');

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Annotation #${(index ?? 0) + 1}`,
          message: commentPreview || undefined,
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: destructiveIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return; // Cancel
          if (onDelete && buttonIndex === 1) {
            handleDelete();
          } else if (onEdit) {
            handleEdit();
          }
        }
      );
    } else {
      Alert.alert(
        `Annotation #${(index ?? 0) + 1}`,
        commentPreview || 'No comment',
        [
          ...(onEdit ? [{ text: 'Edit', onPress: handleEdit }] : []),
          ...(onDelete ? [{ text: 'Delete', style: 'destructive' as const, onPress: handleDelete }] : []),
          { text: 'Cancel', style: 'cancel' as const },
        ]
      );
    }
  };

  const markerContent = (
    <View style={[
      styles.markerInner,
      { width: markerSize, height: markerSize, borderRadius: markerSize / 2, backgroundColor: color },
    ]}>
      {isPending ? (
        <Text style={styles.markerPlus}>+</Text>
      ) : (
        <Text style={styles.markerText}>
          {index !== undefined ? index + 1 : '?'}
        </Text>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.marker,
        {
          left: adjustedX - markerSize / 2,
          top: adjustedY - markerSize / 2,
          width: markerSize,
          height: markerSize,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        isSelected && styles.markerSelected,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        disabled={isPending}
      >
        {markerContent}
      </TouchableOpacity>
    </Animated.View>
  );
});

export function PendingMarker({ x, y, color = '#3c82f7' }: { x: number; y: number; color?: string }) {
  const markerSize = 22;

  return (
    <View
      style={[
        styles.marker,
        styles.pendingMarker,
        {
          left: x - markerSize / 2,
          top: y - markerSize / 2,
          width: markerSize,
          height: markerSize,
        },
      ]}
      pointerEvents="none"
    >
      <View style={[
        styles.markerInner,
        { width: markerSize, height: markerSize, borderRadius: markerSize / 2, backgroundColor: color },
      ]}>
        <Text style={styles.markerPlus}>+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    zIndex: 998,
  },
  touchable: {
    flex: 1,
  },
  pendingMarker: {
    zIndex: 1001,
  },
  markerInner: {
    backgroundColor: '#3c82f7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pendingMarkerInner: {
    backgroundColor: '#34C759',
  },
  markerInnerSelected: {
    backgroundColor: '#FF9500',
  },
  markerSelected: {
    zIndex: 9999,
  },
  markerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  markerPlus: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    marginTop: -1,
  },
});
