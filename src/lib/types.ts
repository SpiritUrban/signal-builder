export type RoadmapStatus = "planned" | "in_progress" | "done" | "skipped" | "problem" | "closed" | "not_evaluated";
export type RoadmapPriority = "high" | "medium" | "low" | "none";

export type RoadmapCategory =
  | "Карти"
  | "Соцмережі"
  | "Каталоги"
  | "Оголошення"
  | "Ресурси"
  | "Спільноти"
  | "ЗМІ"
  | "Платформи"
  | "Контент"
  | "Відгуки";

export interface RoadmapItem {
  id: number;
  title: string;
  category: RoadmapCategory;
  level: number;
  priority: RoadmapPriority;
  status: RoadmapStatus;
  url: string;
  targetUrl: string;
  serviceType?: string;
  seoValue: number;
  difficulty: number;
  recommendedText: string;
  notes: string;
  lastChecked?: string;
  archived?: boolean;
  updatedAt: string;
}

export type CardSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export interface CardSaveState {
  status: CardSaveStatus;
  attempt: number;
}
