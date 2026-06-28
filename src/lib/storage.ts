import { initialRoadmap } from "@/data/initialRoadmap";
import type { RoadmapItem, RoadmapState } from "./types";

export const STORAGE_KEY = "my-transfer-roadmap-state";

export function loadState(): RoadmapState {
  const fallback = { items: initialRoadmap, updatedAt: "" };
  if (typeof window === "undefined") return fallback;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<RoadmapState>;
    const savedItems = new Map((saved.items ?? []).map((item) => [item.id, item]));
    return {
      items: initialRoadmap.map((item) => ({ ...item, ...savedItems.get(item.id) })),
      updatedAt: saved.updatedAt ?? "",
    };
  } catch {
    return fallback;
  }
}

export function saveState(items: RoadmapItem[]) {
  const state: RoadmapState = { items, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state.updatedAt;
}
