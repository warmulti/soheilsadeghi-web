import type {
  AbletonCourse,
  Biography,
  BuyingGuide,
  ChatSetting,
  ContactPage,
  DjingCourse,
  Home,
  Navigation,
  Setting,
} from "../../payload-types.ts";

type Clean<T> = Omit<T, "id" | "updatedAt" | "createdAt" | "globalType">;

/** Initial content for every global, in one language. */
export type SeedData = {
  settings: Omit<Clean<Setting>, "photo">;
  navigation: Clean<Navigation>;
  home: Clean<Home>;
  "djing-course": Clean<DjingCourse>;
  "ableton-course": Clean<AbletonCourse>;
  "buying-guide": Clean<BuyingGuide>;
  biography: Clean<Biography>;
  "contact-page": Clean<ContactPage>;
  "chat-settings": Clean<ChatSetting>;
};

export const t = (text: string) => ({ text });
