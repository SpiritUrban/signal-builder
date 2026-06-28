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
    const response = await fetch(`${supabaseUrl}/rest/v1/__connection_probe?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: supabasePublishableKey,
      },
      cache: "no-store",
    });
    const latency = Math.round(performance.now() - startedAt);
    const isConnected = response.ok || response.status === 404;

    return {
      status: isConnected ? "online" : "offline",
      latency,
      httpStatus: response.status,
      project,
      checkedAt: new Date().toISOString(),
      message: isConnected
        ? response.status === 404
          ? "REST доступний · probe-таблиця не потрібна"
          : "З’єднання стабільне"
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
