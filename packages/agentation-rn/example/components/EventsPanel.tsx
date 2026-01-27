import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

export interface ApiEvent {
  id: string;
  type: 'onAnnotationAdd' | 'onAnnotationUpdate' | 'onAnnotationDelete' | 'onCopy' | 'onAnnotationsClear';
  data: Record<string, unknown>;
  timestamp: number;
}

interface EventsPanelProps {
  events: ApiEvent[];
  onClear: () => void;
  enabled?: boolean;
}

const EVENT_COLORS: Record<ApiEvent['type'], string> = {
  onAnnotationAdd: '#34c759',
  onAnnotationUpdate: '#ff9500',
  onAnnotationDelete: '#ff3b30',
  onCopy: '#007aff',
  onAnnotationsClear: '#ff3b30',
};

export function EventsPanel({ events, onClear, enabled = true }: EventsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const slideAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  const screenWidth = Dimensions.get('window').width;
  const panelWidth = Math.min(300, screenWidth * 0.45);

  if (!enabled) {
    return null;
  }

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, slideAnim]);

  useEffect(() => {
    // Auto-scroll to bottom when new events arrive
    if (scrollRef.current && events.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [events.length]);

  const formatData = (data: Record<string, unknown>) => {
    const entries = Object.entries(data).slice(0, 3);
    return entries.map(([key, value]) => {
      let displayValue = value;
      if (typeof value === 'string' && value.length > 25) {
        displayValue = value.slice(0, 25) + '...';
      }
      return `${key}: ${JSON.stringify(displayValue)}`;
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: panelWidth },
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [panelWidth - 32, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.collapseIcon}>{isExpanded ? '›' : '‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Events</Text>
        {events.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {isExpanded && (
        <ScrollView
          ref={scrollRef}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        >
          {events.length === 0 ? (
            <Text style={styles.emptyText}>No events yet</Text>
          ) : (
            events.map((event) => (
              <View
                key={event.id}
                style={[
                  styles.eventItem,
                  { borderLeftColor: EVENT_COLORS[event.type] },
                ]}
              >
                <Text
                  style={[
                    styles.eventType,
                    { color: EVENT_COLORS[event.type] },
                  ]}
                >
                  {event.type}
                </Text>
                {Object.keys(event.data).length > 0 && (
                  <View style={styles.eventData}>
                    {formatData(event.data).map((line, i) => (
                      <Text key={i} style={styles.eventDataLine}>
                        {line}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 0,
    maxHeight: 350,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  collapseButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapseIcon: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  clearText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  eventsList: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
  eventItem: {
    marginHorizontal: 12,
    marginVertical: 4,
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 6,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Menlo',
  },
  eventData: {
    marginTop: 4,
  },
  eventDataLine: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Menlo',
    lineHeight: 14,
  },
});
