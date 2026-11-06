import type { CollectionConfig } from "payload";
import { groupIdsOf, isStaff, isStaffUser } from "../access.ts";
import { area, label, sel, text } from "../fields.ts";

export const Groups: CollectionConfig = {
  slug: "groups",
  labels: { singular: label("گروه", "Group"), plural: label("گروه‌ها", "Groups") },
  admin: {
    group: label("کاربران و گروه‌ها", "People"),
    useAsTitle: "name",
    defaultColumns: ["name", "course", "updatedAt"],
    description: label(
      "مثلاً «DJing مبتدی ـ پاییز». هنرجوها را از صفحه کاربر به گروه اضافه کنید و برای هر محتوا گروه‌ها را انتخاب کنید.",
      "e.g. “DJing Beginner — Autumn”. Add students from their user page, then pick groups on each item.",
    ),
  },
  access: {
    // Students can read the groups they belong to (to see the group names in their panel).
    read: ({ req }) => (isStaffUser(req.user) ? true : req.user ? { id: { in: groupIdsOf(req.user) } } : false),
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    text("name", "نام گروه", "Group name", { required: true, localized: true }),
    sel("course", "دوره", "Course", [
      ["djing-beginner", "DJing مبتدی", "DJing Beginner"],
      ["djing-pro", "DJing حرفه‌ای", "DJing Pro"],
      ["djing-masterclass", "Master Class", "Master Class"],
      ["ableton", "Ableton Live", "Ableton Live"],
      ["other", "سایر", "Other"],
    ]),
    area("description", "توضیحات", "Description", { localized: true }),
  ],
};
