import { formatDistanceToNow } from 'date-fns';

/**
 * Safely formats a date as distance from now
 * Returns fallback text if date is invalid/null/undefined
 * @param {string|Date|null|undefined} dateValue - The date to format
 * @param {string} fallback - Text to return if date is invalid (default: "Unknown date")
 * @returns {string} Formatted distance string or fallback text
 */
export const formatDateSafe = (dateValue, fallback = 'Unknown date') => {
  try {
    // Handle null/undefined
    if (!dateValue) {
      return fallback;
    }

    // Convert string to Date if needed
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

    // Validate the date is a valid Date object with valid time value
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return fallback;
    }

    // Ensure date is not in the future (which could cause issues)
    if (date > new Date()) {
      return fallback;
    }

    return formatDistanceToNow(date, { addSuffix: false });
  } catch (error) {
    // Catch any unexpected errors during formatting
    console.warn('Date formatting error:', error);
    return fallback;
  }
};