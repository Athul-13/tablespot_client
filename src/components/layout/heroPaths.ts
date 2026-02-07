/**
 * Paths that use a full-bleed hero (content under navbar, transparent nav at top).
 * Used by MainLayout (padding) and Navbar (transparency behavior).
 */
const HERO_PATH_EXACT = ['/', '/restaurants', '/profile'] as const;
const HERO_PATH_PATTERN = /^\/restaurant\/[^/]+$/;

export function isHeroPath(pathname: string): boolean {
  if (HERO_PATH_EXACT.includes(pathname as (typeof HERO_PATH_EXACT)[number])) return true;
  return HERO_PATH_PATTERN.test(pathname);
}
