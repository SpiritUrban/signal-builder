import { createClient } from "@supabase/supabase-js";

function requirePublicEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const supabaseUrl = requirePublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
const supabasePublishableKey = requirePublicEnv(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
);
const supabaseProbeEndpoint = `${supabaseUrl}/rest/v1/roadmap_items?select=id&limit=1`;
const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? "local-dev";

export const supabaseDebug = {
  url: supabaseUrl,
  hasKey: Boolean(supabasePublishableKey),
  keyLength: supabasePublishableKey.length,
  keyPrefix: supabasePublishableKey.slice(0, 15),
  endpoint: supabaseProbeEndpoint,
  buildTimestamp,
};

console.info("[Supabase debug]", supabaseDebug);

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export interface SupabaseHealth {
  status: "checking" | "online" | "offline";
  latency: number | null;
  httpStatus: number | null;
  project: string;
  checkedAt: string | null;
  message: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const startedAt = performance.now();
  const project = new URL(supabaseUrl).hostname;

  try {
    const response = await fetch(supabaseProbeEndpoint, {
      method: "GET",
      headers: {
        apikey: supabasePublishableKey,
      },
      cache: "no-store",
    });
    const latency = Math.round(performance.now() - startedAt);
    const isConnected = response.ok;

    return {
      status: isConnected ? "online" : "offline",
      latency,
      httpStatus: response.status,
      project,
      checkedAt: new Date().toISOString(),
      message: isConnected
        ? "Roadmap API і база доступні"
        : response.status === 401
          ? "Supabase не прийняв publishable key"
          : `Сервер відповів із помилкою ${response.status}`,
    };
  } catch {
    return {
      status: "offline",
      latency: Math.round(performance.now() - startedAt),
      httpStatus: null,
      project,
      checkedAt: new Date().toISOString(),
      message: "Не вдалося підключитися до Supabase",
    };
  }
}
