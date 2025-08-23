/**
 * Builds a redirect URL with optional query parameters
 */
export function buildRedirectUrl(
  path: string,
  redirectTo?: string | null,
  includeOrigin: boolean = false
): string {
  const base = includeOrigin
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${path}`
    : path;

  return redirectTo
    ? `${base}?redirectTo=${encodeURIComponent(redirectTo)}`
    : base;
}
