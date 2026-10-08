import "server-only";
import { redirect, forbidden } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "./get-current-user";

type Role = "admin" | "teacher";

/**
 * Ensures the current user is signed in and has one of the allowed roles.
 * Redirects to /login if unauthenticated, throws 403 (via forbidden()) if
 * the role is not allowed.
 */
export async function requireRole(
  allowed: Role | Role[],
): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedRoles.includes(user.profile.role)) {
    forbidden();
  }

  return user;
}