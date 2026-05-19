export function restrictTo(userRole: string, ...allowedRoles: string[]) {
  if (allowedRoles.includes(userRole)) return true;
  return false;
}
