import type { PageFeedback } from "./types.js";

/**
 * In-memory store for page feedback
 * Keyed by pathname for easy lookup
 */
class FeedbackStore {
  private pages: Map<string, PageFeedback> = new Map();

  /**
   * Update feedback for a page (full replacement)
   */
  set(pathname: string, feedback: Omit<PageFeedback, "timestamp">): void {
    this.pages.set(pathname, {
      ...feedback,
      timestamp: Date.now(),
    });
  }

  /**
   * Get feedback for a specific page
   */
  get(pathname: string): PageFeedback | undefined {
    return this.pages.get(pathname);
  }

  /**
   * Get all pages with feedback
   */
  getAll(): PageFeedback[] {
    return Array.from(this.pages.values());
  }

  /**
   * Get all pages that have at least one annotation
   */
  getPagesWithFeedback(): { pathname: string; url: string; count: number }[] {
    const result: { pathname: string; url: string; count: number }[] = [];

    for (const [pathname, feedback] of this.pages) {
      if (feedback.annotations.length > 0) {
        result.push({
          pathname,
          url: feedback.url,
          count: feedback.annotations.length,
        });
      }
    }

    return result;
  }

  /**
   * Clear feedback for a specific page
   */
  clear(pathname: string): boolean {
    return this.pages.delete(pathname);
  }

  /**
   * Clear all feedback
   */
  clearAll(): void {
    this.pages.clear();
  }

  /**
   * Get total annotation count across all pages
   */
  getTotalCount(): number {
    let count = 0;
    for (const page of this.pages.values()) {
      count += page.annotations.length;
    }
    return count;
  }
}

// Singleton instance
export const store = new FeedbackStore();
