import { useState, useCallback } from 'react';
import type { Annotation } from 'agentation-rn';
import type { ApiEvent } from '../components/EventsPanel';

export interface AgenationCallbacks {
  onAnnotationAdd: (annotation: Annotation) => void;
  onAnnotationUpdate: (annotation: Annotation) => void;
  onAnnotationDelete: (annotation: Annotation) => void;
  onCopy: (markdown: string) => void;
  onAnnotationsClear: (cleared: Annotation[]) => void;
}

export interface UseApiEventsReturn {
  events: ApiEvent[];
  clearEvents: () => void;
  callbacks: AgenationCallbacks;
}

export function useApiEvents(maxEvents = 20): UseApiEventsReturn {
  const [events, setEvents] = useState<ApiEvent[]>([]);

  const addEvent = useCallback((type: ApiEvent['type'], data: Record<string, unknown>) => {
    const event: ApiEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      data,
      timestamp: Date.now(),
    };
    setEvents(prev => [...prev.slice(-(maxEvents - 1)), event]);
  }, [maxEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const callbacks: AgenationCallbacks = {
    onAnnotationAdd: useCallback((annotation: Annotation) => {
      addEvent('onAnnotationAdd', {
        element: annotation.element,
        comment: annotation.comment,
      });
    }, [addEvent]),

    onAnnotationUpdate: useCallback((annotation: Annotation) => {
      addEvent('onAnnotationUpdate', {
        element: annotation.element,
        comment: annotation.comment,
      });
    }, [addEvent]),

    onAnnotationDelete: useCallback((annotation: Annotation) => {
      addEvent('onAnnotationDelete', {
        element: annotation.element,
      });
    }, [addEvent]),

    onCopy: useCallback((markdown: string) => {
      addEvent('onCopy', {
        length: markdown.length,
        format: 'markdown',
      });
    }, [addEvent]),

    onAnnotationsClear: useCallback((cleared: Annotation[]) => {
      addEvent('onAnnotationsClear', {
        count: cleared.length,
      });
    }, [addEvent]),
  };

  return { events, clearEvents, callbacks };
}
