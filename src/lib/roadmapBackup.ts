import type { RoadmapItem, RoadmapStatus } from "./types";

const FORMAT = "my-transfer-roadmap-backup";
const VERSION = 1;
const allowedStatuses = new Set<RoadmapStatus>(["planned", "in_progress", "done", "skipped", "problem"]);

export interface RoadmapBackup {
  format: typeof FORMAT;
  version: number;
  exportedAt: string;
  description: string;
  restoreInstructions: string;
  itemCount: number;
  summary: Record<RoadmapStatus, number>;
  items: RoadmapItem[];
}

export function createRoadmapBackup(items: RoadmapItem[]): RoadmapBackup {
  const summary = Object.fromEntries(
    [...allowedStatuses].map((status) => [status, items.filter((item) => item.status === status).length]),
  ) as Record<RoadmapStatus, number>;

  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    description: "Повний стан roadmap My Transfer: статуси, URL розміщень, нотатки та метадані карток.",
    restoreInstructions: "Відкрити меню backup у Signal Builder та обрати «Відновити з JSON».",
    itemCount: items.length,
    summary,
    items,
  };
}

export function parseRoadmapBackup(source: string): RoadmapBackup {
  const value = JSON.parse(source) as Partial<RoadmapBackup>;
  if (value.format !== FORMAT || value.version !== VERSION || !Array.isArray(value.items)) {
    throw new Error("Файл не є сумісним backup My Transfer Roadmap.");
  }
  if (!value.items.length || value.items.some((item) =>
    !Number.isInteger(item.id) ||
    typeof item.title !== "string" ||
    !allowedStatuses.has(item.status) ||
    typeof item.targetUrl !== "string" ||
    typeof item.notes !== "string"
  )) {
    throw new Error("Backup містить пошкоджені або неповні картки.");
  }
  const ids = new Set(value.items.map((item) => item.id));
  if (ids.size !== value.items.length) throw new Error("Backup містить дублікати ID карток.");
  return value as RoadmapBackup;
}
