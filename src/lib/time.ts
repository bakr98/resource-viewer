import { formatDistanceToNowStrict } from "date-fns";

/**
 * A helper to convert a timestamp into a useful string like "3 minutes ago".
 * Returns a dash/"-" if value is missing.
 */
export function relative(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatDistanceToNowStrict(d)} ago`;
}