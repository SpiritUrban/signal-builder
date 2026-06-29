import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { initialRoadmap } from "@/data/initialRoadmap";
import { supabase } from "./supabase";
import type { RoadmapItem, RoadmapPriority, RoadmapStatus } from "./types";

const TABLE = "roadmap_items";
let extendedSchemaAvailable: boolean | undefined;

export interface RoadmapRow {
  id: number;
  status: RoadmapStatus;
  priority?: RoadmapPriority | null;
  target_url: string;
  service_type?: string | null;
  notes: string;
  last_checked?: string | null;
  archived?: boolean | null;
  updated_at: string;
}

type LegacyRoadmapRow = Pick<RoadmapRow, "id" | "status" | "target_url" | "notes">;

function toRow(item: RoadmapItem): Omit<RoadmapRow, "updated_at"> {
  return {
    id: item.id,
    status: item.status,
    priority: item.priority,
    target_url: item.targetUrl,
    service_type: item.serviceType ?? null,
    notes: item.notes,
    last_checked: item.lastChecked ?? null,
    archived: item.archived ?? false,
  };
}

function toLegacyRow(item: RoadmapItem): LegacyRoadmapRow {
  return {
    id: item.id,
    status: item.status,
    target_url: item.targetUrl,
    notes: item.notes,
  };
}

function supportsLegacySchema(item: RoadmapItem) {
  return item.status !== "closed" && item.status !== "not_evaluated";
}

export function mergeRoadmapRow(item: RoadmapItem, row: RoadmapRow): RoadmapItem {
  return {
    ...item,
    status: item.archived ? item.status : row.status,
    priority: row.priority ?? item.priority,
    targetUrl: row.target_url,
    serviceType: row.service_type ?? item.serviceType,
    notes: item.archived ? item.notes : row.notes,
    lastChecked: row.last_checked ?? item.lastChecked,
    archived: row.archived ?? item.archived,
    updatedAt: row.updated_at,
  };
}

export async function loadRoadmapItems(): Promise<RoadmapItem[]> {
  const { data, error } = await supabase.from(TABLE).select("*").order("id");
  if (error) throw error;

  const rows = (data ?? []) as RoadmapRow[];
  if (rows.length) extendedSchemaAvailable = Object.prototype.hasOwnProperty.call(rows[0], "archived");
  const existingIds = new Set(rows.map((row) => row.id));
  const missing = initialRoadmap.filter((item) => !existingIds.has(item.id));

  if (missing.length) {
    if (extendedSchemaAvailable === false) {
      const legacyMissing = missing.filter(supportsLegacySchema);
      if (legacyMissing.length) {
        const { data: legacyInserted, error: legacyError } = await supabase
          .from(TABLE)
          .upsert(legacyMissing.map(toLegacyRow), { onConflict: "id", ignoreDuplicates: true })
          .select();
        if (legacyError) throw legacyError;
        rows.push(...((legacyInserted ?? []) as RoadmapRow[]));
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from(TABLE)
        .upsert(missing.map(toRow), { onConflict: "id", ignoreDuplicates: true })
        .select();
      if (!insertError) {
        rows.push(...((inserted ?? []) as RoadmapRow[]));
      } else {
        const legacyMissing = missing.filter(supportsLegacySchema);
        if (legacyMissing.length) {
          const { data: legacyInserted, error: legacyError } = await supabase
          .from(TABLE)
          .upsert(legacyMissing.map(toLegacyRow), { onConflict: "id", ignoreDuplicates: true })
          .select();
          if (legacyError) throw legacyError;
          rows.push(...((legacyInserted ?? []) as RoadmapRow[]));
        }
      }
    }
  }

  const rowById = new Map(rows.map((row) => [row.id, row]));
  return initialRoadmap.map((item) => {
    const row = rowById.get(item.id);
    return row ? mergeRoadmapRow(item, row) : item;
  });
}

export async function saveRoadmapItem(item: RoadmapItem): Promise<RoadmapRow> {
  if (extendedSchemaAvailable === false && supportsLegacySchema(item)) {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(toLegacyRow(item), { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return data as RoadmapRow;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(toRow(item), { onConflict: "id" })
    .select()
    .single();
  if (error) {
    if (!supportsLegacySchema(item)) throw error;
    const { data: legacyData, error: legacyError } = await supabase
      .from(TABLE)
      .upsert(toLegacyRow(item), { onConflict: "id" })
      .select()
      .single();
    if (legacyError) throw legacyError;
    return legacyData as RoadmapRow;
  }
  return data as RoadmapRow;
}

export async function restoreRoadmapItems(items: RoadmapItem[]): Promise<RoadmapItem[]> {
  if (extendedSchemaAvailable === false) {
    const legacyItems = items.filter(supportsLegacySchema);
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(legacyItems.map(toLegacyRow), { onConflict: "id" })
      .select();
    if (error) throw error;

    const rowById = new Map(((data ?? []) as RoadmapRow[]).map((row) => [row.id, row]));
    return items.map((item) => {
      const row = rowById.get(item.id);
      return row ? mergeRoadmapRow(item, row) : item;
    });
  }

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(items.map(toRow), { onConflict: "id" })
    .select();
  if (error) {
    const legacyItems = items.filter(supportsLegacySchema);
    const { data: legacyData, error: legacyError } = await supabase
      .from(TABLE)
      .upsert(legacyItems.map(toLegacyRow), { onConflict: "id" })
      .select();
    if (legacyError) throw legacyError;

    const legacyRowById = new Map(((legacyData ?? []) as RoadmapRow[]).map((row) => [row.id, row]));
    return items.map((item) => {
      const row = legacyRowById.get(item.id);
      return row ? mergeRoadmapRow(item, row) : item;
    });
  }

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
