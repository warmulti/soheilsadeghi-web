import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField, isStaffField, isStaffUser, roleOf } from "../access.ts";
import { label, sel, text } from "../fields.ts";
import { localeOfReq, mailEnabled, resetPasswordEmail, verificationEmail } from "../email.ts";

/**
 * Accounts that need no email confirmation: made by staff in the panel, or created while no mail
 * server is configured (otherwise nobody could ever confirm them).
 */
const confirmedOnCreate = (user: unknown) => isStaffUser(user) || !mailEnabled();

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: label("کاربر", "User"), plural: label("کاربران", "Users") },
  admin: {
    group: label("کاربران و گروه‌ها", "People"),
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role", "groups"],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: "Lax", secure: process.env.NODE_ENV === "production" },
    forgotPassword: {
      generateEmailSubject: (args) => resetPasswordEmail(localeOfReq(args?.req), "").subject,
      generateEmailHTML: (args) => resetPasswordEmail(localeOfReq(args?.req), args?.token ?? "").html,
    },
    // Self-registered students confirm their email before they can log in.
    // The very first admin and accounts in `confirmedOnCreate` are confirmed automatically.
    verify: {
      generateEmailSubject: ({ req }) => verificationEmail(localeOfReq(req), "").subject,
      generateEmailHTML: ({ req, token, user }) =>
        verificationEmail(localeOfReq(req), token, (user as { name?: string } | undefined)?.name).html,
    },
  },
  access: {
    // Only staff can open /admin
    admin: ({ req }) => isStaffUser(req.user),
    // Public sign-up is allowed; the hook below turns every self-registration into a student.
    create: () => true,
    read: ({ req }) => (isStaffUser(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (isStaffUser(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: isAdmin,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation, req }) => {
        if (operation !== "create") return args;
        const first = (await req.payload.count({ collection: "users", overrideAccess: true })).totalDocs === 0;
        return first || confirmedOnCreate(req.user) ? { ...args, disableVerificationEmail: true } : args;
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
        if (totalDocs === 0) return { ...data, role: "admin", _verified: true }; // very first account = site owner
        const verified = confirmedOnCreate(req.user) ? { _verified: true } : {};
        if (roleOf(req.user) !== "admin") {
          return { ...data, ...verified, role: "student", groups: isStaffUser(req.user) ? data.groups : [] };
        }
        return { ...data, ...verified };
      },
    ],
  },
  fields: [
    text("name", "نام و نام خانوادگی", "Full name", { required: true }),
    sel(
      "role",
      "نقش",
      "Role",
      [
        ["admin", "مدیر کل", "Administrator"],
        ["editor", "ویرایشگر محتوا", "Editor"],
        ["student", "هنرجو", "Student"],
      ],
      {
        required: true,
        defaultValue: "student",
        saveToJWT: true,
        access: { create: isAdminField, update: isAdminField },
        // Hidden on the "create first user" screen: that very first account always becomes admin.
        admin: { position: "sidebar", condition: (_d: unknown, _s: unknown, ctx: { user?: unknown }) => Boolean(ctx?.user) },
      },
    ),
    {
      name: "groups",
      type: "relationship",
      relationTo: "groups",
      hasMany: true,
      label: label("گروه‌ها", "Groups"),
      saveToJWT: true,
      access: { create: isStaffField, update: isStaffField },
      admin: {
        position: "sidebar",
        condition: (_d: unknown, _s: unknown, ctx: { user?: unknown }) => Boolean(ctx?.user),
        description: label("هنرجو محتوای گروه‌هایی که عضو آن‌هاست را می‌بیند.", "Students see content of their groups."),
      },
    },
    text("phone", "شماره تماس", "Phone"),
  ],
};
