import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField, isStaffField, isStaffUser, roleOf } from "../access.ts";
import { label, sel, text } from "../fields.ts";

const serverUrl = () => process.env.SERVER_URL || "http://localhost:3000";

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
      generateEmailSubject: () => "بازیابی رمز عبور | DJ Soheil",
      generateEmailHTML: (args) => {
        const link = `${serverUrl()}/reset-password?token=${encodeURIComponent(args?.token ?? "")}`;
        return `<div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:2">
          <p>سلام،</p><p>برای تعیین رمز عبور جدید روی لینک زیر بزنید:</p>
          <p><a href="${link}">${link}</a></p>
          <p style="color:#888">اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید.</p>
          <hr><p dir="ltr">To reset your password open the link above.</p></div>`;
      },
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
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
        if (totalDocs === 0) return { ...data, role: "admin" }; // very first account = site owner
        if (roleOf(req.user) !== "admin") return { ...data, role: "student", groups: isStaffUser(req.user) ? data.groups : [] };
        return data;
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
