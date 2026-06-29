/**
 * Returns true when `userRole` is in the `allowedRoles` list.
 * Used to conditionally render UI elements based on the user's role.
 */
export function restrictTo(userRole: string, ...allowedRoles: string[]) {
  if (allowedRoles.includes(userRole)) return true;
  return false;
}
