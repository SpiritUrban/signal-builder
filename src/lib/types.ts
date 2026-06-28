export type RoadmapStatus = "planned" | "in_progress" | "done" | "skipped" | "problem";

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
  priority: "high" | "medium" | "low";
  status: RoadmapStatus;
  url: string;
  targetUrl: string;
  seoValue: number;
  difficulty: number;
  recommendedText: string;
  notes: string;
  updatedAt: string;
}

export type CardSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export interface CardSaveState {
  status: CardSaveStatus;
  attempt: number;
}
