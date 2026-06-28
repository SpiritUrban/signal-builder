import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { initialRoadmap } from "@/data/initialRoadmap";
import { supabase } from "./supabase";
import type { RoadmapItem, RoadmapStatus } from "./types";

const TABLE = "roadmap_items";

export interface RoadmapRow {
  id: number;
  status: RoadmapStatus;
  target_url: string;
  notes: string;
  updated_at: string;
}

function toRow(item: RoadmapItem): Omit<RoadmapRow, "updated_at"> {
  return {
    id: item.id,
    status: item.status,
    target_url: item.targetUrl,
    notes: item.notes,
  };
}

export function mergeRoadmapRow(item: RoadmapItem, row: RoadmapRow): RoadmapItem {
  return {
    ...item,
    status: row.status,
    targetUrl: row.target_url,
    notes: row.notes,
    updatedAt: row.updated_at,
  };
}

export async function loadRoadmapItems(): Promise<RoadmapItem[]> {
  const { data, error } = await supabase.from(TABLE).select("*").order("id");
  if (error) throw error;

  const rows = (data ?? []) as RoadmapRow[];
  const existingIds = new Set(rows.map((row) => row.id));
  const missing = initialRoadmap.filter((item) => !existingIds.has(item.id)).map(toRow);

  if (missing.length) {
    const { data: inserted, error: insertError } = await supabase
      .from(TABLE)
      .upsert(missing, { onConflict: "id", ignoreDuplicates: true })
      .select();
    if (insertError) throw insertError;
    rows.push(...((inserted ?? []) as RoadmapRow[]));
  }

  const rowById = new Map(rows.map((row) => [row.id, row]));
  return initialRoadmap.map((item) => {
    const row = rowById.get(item.id);
    return row ? mergeRoadmapRow(item, row) : item;
  });
}

export async function saveRoadmapItem(item: RoadmapItem): Promise<RoadmapRow> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(toRow(item), { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as RoadmapRow;
}

export async function restoreRoadmapItems(items: RoadmapItem[]): Promise<RoadmapItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(items.map(toRow), { onConflict: "id" })
    .select();
  if (error) throw error;

  const rowById = new Map(((data ?? []) as RoadmapRow[]).map((row) => [row.id, row]));
  return items.map((item) => {
    const row = rowById.get(item.id);
    return row ? mergeRoadmapRow(item, row) : item;
  });
}

export function subscribeToRoadmapChanges(onChange: (row: RoadmapRow) => void) {
  const channel = supabase
    .channel("roadmap-items-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      (payload: RealtimePostgresChangesPayload<RoadmapRow>) => {
        if (payload.eventType !== "DELETE") onChange(payload.new as RoadmapRow);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
