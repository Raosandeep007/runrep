/**
 * Helper to trigger view transitions manually
 * Use this for state updates or programmatic transitions
 */
export function startViewTransition(callback: () => void) {
  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof (document as any).startViewTransition === "function"
  ) {
    (document as any).startViewTransition(callback);
  } else {
    // Fallback for browsers that don't support View Transitions
    callback();
  }
}
