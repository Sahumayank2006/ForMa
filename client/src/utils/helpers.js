// Utility helper functions

/**
 * Safely extract name from a user/child object or return the value if it's already a string
 * Handles MongoDB populated references that return {_id, name} objects
 * @param {Object|String} value - Either a populated object with name property or a string
 * @param {String} fallback - Fallback text if value is null/undefined
 * @returns {String}
 */
export const getDisplayName = (value, fallback = 'N/A') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.name) return value.name;
  return fallback;
};

/**
 * Format minutes into human-readable time
 * @param {Number} minutes - Number of minutes
 * @returns {String}
 */
export const formatMinutes = (minutes) => {
  if (!minutes && minutes !== 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

/**
 * Format timestamp to relative time (e.g., "5m ago", "2h ago")
 * @param {Date|String} dateString - Date to format
 * @returns {String}
 */
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

/**
 * Get alert level based on time since last diaper change
 * @param {Number} timeSinceLastChange - Minutes since last change
 * @returns {String} - 'green', 'yellow', or 'red'
 */
export const getDiaperAlertLevel = (timeSinceLastChange) => {
  if (!timeSinceLastChange) return 'green';
  if (timeSinceLastChange < 120) return 'green'; // < 2 hours
  if (timeSinceLastChange < 180) return 'yellow'; // 2-3 hours
  return 'red'; // > 3 hours
};

/**
 * Extract data from API response (handles both direct data and {data: ...} structure)
 * @param {Object|Array} response - API response
 * @returns {Object|Array}
 */
export const extractApiData = (response) => {
  if (!response) return null;
  if (Array.isArray(response)) return response;
  if (response.data !== undefined) return response.data;
  return response;
};
