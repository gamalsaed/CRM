import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. These are thin wrappers around the
 * standard Next.js navigation APIs that automatically prepend the active
 * locale prefix to every path.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
