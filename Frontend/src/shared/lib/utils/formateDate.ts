/**
 * Formats a date value as a short human-readable string (e.g. "Jun 16, 2026").
 * Always uses the UTC timezone to avoid date-shifting caused by local offsets.
 */
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
