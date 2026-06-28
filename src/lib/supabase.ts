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
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
      },
      cache: "no-store",
    });
    const latency = Math.round(performance.now() - startedAt);

    return {
      status: response.ok ? "online" : "offline",
      latency,
      httpStatus: response.status,
      project,
      checkedAt: new Date().toISOString(),
      message: response.ok ? "З’єднання стабільне" : `Сервер відповів із помилкою ${response.status}`,
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
