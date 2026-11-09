/**
 * Transactional SMS through sms.ir (https://sms.ir).
 *
 * Used to notify Soheil of a new student sign-up or a contact-form request — a backup for the
 * Telegram notification, which is blocked from the Iranian server. It is strictly transactional
 * (one message per real event); it is not a bulk-marketing tool.
 *
 * Configure with environment variables (all optional — SMS is simply off when they're missing):
 *   SMSIR_API_KEY        your sms.ir panel API key
 *   SMSIR_LINE_NUMBER    the sending line number bought in the sms.ir panel
 *   SMS_NOTIFY_MOBILE    the mobile that receives owner notifications (09xxxxxxxxx)
 *   SMSIR_BASE_URL       override the API base (used by tests; defaults to the real endpoint)
 *
 * Every function catches its own errors and returns a result object — an SMS problem must never
 * break the visitor's sign-up or message.
 */

const baseUrl = () => (process.env.SMSIR_BASE_URL || "https://api.sms.ir/v1").replace(/\/$/, "");

export const smsEnabled = () => Boolean(process.env.SMSIR_API_KEY && process.env.SMSIR_LINE_NUMBER);

/** The owner's mobile for notifications, normalized; "" when unset or invalid. */
export const smsNotifyMobile = () => normalizeIrMobile(process.env.SMS_NOTIFY_MOBILE || "");

/**
 * Normalizes an Iranian mobile number to the local `09xxxxxxxxx` form.
 * Accepts `+98…`, `0098…`, `98…`, `9…`. Returns "" if it isn't a valid IR mobile.
 */
export function normalizeIrMobile(input: string): string {
  let d = String(input || "")
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98") && d.length === 12) d = d.slice(2);
  if (d.startsWith("9") && d.length === 10) d = `0${d}`;
  return /^09\d{9}$/.test(d) ? d : "";
}

export type SmsResult = { ok: boolean; status: number; messageIds?: number[]; error?: string };

type SmsApiResponse = { status?: number; message?: string; data?: { messageIds?: number[]; messageId?: number } };

async function post(path: string, body: unknown): Promise<{ status: number; json: SmsApiResponse | null }> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-api-key": process.env.SMSIR_API_KEY || "",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  let json: SmsApiResponse | null = null;
  try {
    json = (await res.json()) as SmsApiResponse;
  } catch {
    // non-JSON body
  }
  return { status: res.status, json };
}

const succeeded = (status: number, json: SmsApiResponse | null) => status >= 200 && status < 300 && json?.status === 1;

/** Sends one plain message to one or more Iranian mobiles. */
export async function sendSms(mobiles: string | string[], text: string): Promise<SmsResult> {
  if (!smsEnabled()) return { ok: false, status: 0, error: "sms disabled" };
  const list = [...new Set((Array.isArray(mobiles) ? mobiles : [mobiles]).map(normalizeIrMobile).filter(Boolean))];
  if (!list.length) return { ok: false, status: 0, error: "no valid mobile" };
  try {
    const { status, json } = await post("/send/bulk", {
      lineNumber: Number(process.env.SMSIR_LINE_NUMBER),
      messageText: text,
      mobiles: list,
    });
    const ok = succeeded(status, json);
    return { ok, status, messageIds: json?.data?.messageIds, error: ok ? undefined : json?.message || `HTTP ${status}` };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "sms error" };
  }
}

/**
 * Sends a message through a sms.ir template ("verify" fast-send) — the channel used for one-time
 * codes. Provided for a future SMS verification flow; not wired into the site yet.
 */
export async function sendVerify(
  mobile: string,
  templateId: number,
  parameters: Record<string, string | number>,
): Promise<SmsResult> {
  if (!smsEnabled()) return { ok: false, status: 0, error: "sms disabled" };
  const m = normalizeIrMobile(mobile);
  if (!m) return { ok: false, status: 0, error: "no valid mobile" };
  try {
    const { status, json } = await post("/send/verify", {
      mobile: m,
      templateId,
      parameters: Object.entries(parameters).map(([name, value]) => ({ name, value: String(value) })),
    });
    const ok = succeeded(status, json);
    const id = json?.data?.messageId;
    return { ok, status, messageIds: id ? [id] : undefined, error: ok ? undefined : json?.message || `HTTP ${status}` };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "sms error" };
  }
}

/** Notifies the site owner by SMS. A safe no-op when SMS or the owner mobile isn't configured. */
export async function notifyOwnerSms(text: string): Promise<boolean> {
  const to = smsNotifyMobile();
  if (!smsEnabled() || !to) return false;
  const res = await sendSms(to, text);
  if (!res.ok) console.error("[sms] owner notification failed:", res.error);
  return res.ok;
}
