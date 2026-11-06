const withText = (base: string, text?: string) => (text ? `${base}?text=${encodeURIComponent(text)}` : base);

/** Direct Telegram chat, optionally with a pre-filled message. */
export const telegramUrl = (username: string, text?: string) => withText(`https://t.me/${username.replace(/^@/, "")}`, text);

/** Direct WhatsApp chat, optionally with a pre-filled message. */
export const whatsappUrl = (number: string, text?: string) => withText(`https://wa.me/${number.replace(/[^\d]/g, "")}`, text);

export const instagramUrl = (username: string) => `https://www.instagram.com/${username.replace(/^@/, "")}/`;
