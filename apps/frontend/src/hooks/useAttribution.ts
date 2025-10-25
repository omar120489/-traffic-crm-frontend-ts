import { useEffect } from 'react';
import { parseAttribution } from 'utils/attribution';

/**
 * Hook to capture and parse attribution data from URL on app mount
 * Runs once per session to extract UTM parameters and platform IDs
 *
 * Usage: Call once in App.jsx or root component
 */
export function useAttribution(): void {
  useEffect(() => {
    try {
      // Parse and store attribution data from current URL
      const attribution = parseAttribution();

      // Intentionally silent to avoid noisy dev logs
      // You can wire this to a toast or analytics debug panel if needed
    } catch (error) {
      console.error('[Attribution] Failed to parse attribution:', error);
    }
  }, []); // Empty deps - run once on mount
}
