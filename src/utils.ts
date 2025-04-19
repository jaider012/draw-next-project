// Custom event system with type safety
// Event types
export interface CustomEventMap {
  skipTo: { timePercentage: number };
  // Add more events here as needed
}

// Event management utilities
export const eventSystem = {
  /**
   * Dispatches a custom event with typed payload
   */
  dispatch<K extends keyof CustomEventMap>(
    eventName: K,
    detail: CustomEventMap[K]
  ): void {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  },

  /**
   * Adds a typed event listener
   */
  addEventListener<K extends keyof CustomEventMap>(
    eventName: K,
    handler: (detail: CustomEventMap[K]) => void
  ): () => void {
    const eventHandler = (event: Event) => {
      const customEvent = event as CustomEvent<CustomEventMap[K]>;
      handler(customEvent.detail);
    };

    window.addEventListener(eventName, eventHandler);
    
    // Return cleanup function
    return () => {
      window.removeEventListener(eventName, eventHandler);
    };
  }
};

// React hooks
import { useCallback, useEffect } from "react";

export function useSkipTo() {
  return useCallback((timePercentage: number) => {
    eventSystem.dispatch("skipTo", { timePercentage });
  }, []);
}

export function useSkipToListener(callback: (timePercentage: number) => void) {
  useEffect(() => {
    const cleanup = eventSystem.addEventListener("skipTo", (detail) => {
      callback(detail.timePercentage);
    });

    return cleanup;
  }, [callback]);
}
