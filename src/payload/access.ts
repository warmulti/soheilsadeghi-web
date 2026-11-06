/**
 * Who can see and change what.
 *  - admin:   everything, including users and roles
 *  - editor:  all content, cannot manage roles
 *  - student: own profile; content of the groups they belong to
 *  - visitor: public content only
 */
import type { Access, FieldAccess, Where } from "payload";

export type Role = "admin" | "editor" | "student";

type MaybeUser = { id?: number | string; role?: Role; groups?: unknown[] | null } | null | undefined;

export const roleOf = (user: unknown): Role | undefined => (user as MaybeUser)?.role;
export const isStaffUser = (user: unknown) => roleOf(user) === "admin" || roleOf(user) === "editor";

/** Group ids of a user, whether `groups` is populated or just ids. */
export function groupIdsOf(user: unknown): (number | string)[] {
  const groups = (user as MaybeUser)?.groups ?? [];
  return groups
    .map((g) => (typeof g === "object" && g !== null ? (g as { id?: number | string }).id : (g as number | string)))
    .filter((g): g is number | string => g !== undefined && g !== null);
}

export const anyone: Access = () => true;
export const isAdmin: Access = ({ req }) => roleOf(req.user) === "admin";
export const isStaff: Access = ({ req }) => isStaffUser(req.user);
export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === "admin";
export const isStaffField: FieldAccess = ({ req }) => isStaffUser(req.user);

/** Staff see drafts; everyone else only published documents. */
export const publishedOrStaff: Access = ({ req }) =>
  isStaffUser(req.user) ? true : ({ _status: { equals: "published" } } as Where);

/**
 * Downloads: `public` and `members` items are listed for everyone (members-only ones show a lock
 * and need a login to download); `groups` items are only visible to members of those groups.
 */
export const downloadsRead: Access = ({ req }) => {
  if (isStaffUser(req.user)) return true;
  const published: Where = { _status: { equals: "published" } };
  const open: Where = { visibility: { in: ["public", "members"] } };
  const ids = req.user ? groupIdsOf(req.user) : [];
  const visible: Where = ids.length
    ? { or: [open, { and: [{ visibility: { equals: "groups" } }, { groups: { in: ids } }] }] }
    : open;
  return { and: [published, visible] };
};

/** Course materials: only for logged-in students of the selected groups (or all students). */
export const materialsRead: Access = ({ req }) => {
  if (isStaffUser(req.user)) return true;
  if (!req.user) return false;
  const ids = groupIdsOf(req.user);
  const audience: Where[] = [{ audience: { equals: "allStudents" } }];
  if (ids.length) audience.push({ groups: { in: ids } });
  const published: Where = { _status: { equals: "published" } };
  const visible: Where = { or: audience };
  return { and: [published, visible] };
};
