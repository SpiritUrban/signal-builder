"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, ExternalLink, Search, Sparkles, Target, Zap } from "lucide-react";
import { initialRoadmap } from "@/data/initialRoadmap";
import { loadState, saveState } from "@/lib/storage";
import { checkSupabaseHealth, supabaseDebug, type SupabaseHealth } from "@/lib/supabase";
import type { RoadmapItem, RoadmapStatus } from "@/lib/types";

const statusLabels: Record<RoadmapStatus, string> = {
  planned: "Заплановано",
  in_progress: "В роботі",
  done: "Готово",
  skipped: "Пропущено",
  problem: "Проблема",
};

export function RoadmapDashboard() {
  const [items, setItems] = useState<RoadmapItem[]>(initialRoadmap);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RoadmapStatus | "all">("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadState().items);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(items);
  }, [items, ready]);

  const stats = useMemo(() => {
    const done = items.filter((item) => item.status === "done").length;
    const active = items.filter((item) => item.status === "in_progress").length;
    return { done, active, planned: items.filter((item) => item.status === "planned").length, progress: Math.round((done / items.length) * 100) };
  }, [items]);

  const visible = items.filter((item) =>
    (filter === "all" || item.status === filter) &&
    `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  const groups = Array.from(new Set(visible.map((item) => item.level)));
  const updateItem = (id: number, patch: Partial<RoadmapItem>) =>
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>MY TRANSFER</span><em>Roadmap</em></div>
        <div className="top-progress"><span>{stats.progress}% виконано</span><div><i style={{ width: `${stats.progress}%` }} /></div></div>
        <DatabaseBeacon />
      </header>

      <div className="shell">
        <section className="hero">
          <div><p className="eyebrow">SEO COMMAND CENTER</p><h1>План присутності<br /><span>My Transfer</span></h1><p>Усі майданчики, статуси та нотатки — в одному робочому просторі.</p></div>
          <div className="orbit"><Target size={38} /><b>{stats.progress}%</b><small>загальний прогрес</small></div>
        </section>

        <section className="stats-grid">
          <Stat icon={<CheckCircle2 />} value={stats.done} label="Виконано" tone="cyan" />
          <Stat icon={<Zap />} value={stats.active} label="В роботі" tone="violet" />
          <Stat icon={<CircleDashed />} value={stats.planned} label="Заплановано" tone="lime" />
          <Stat icon={<Target />} value={items.length} label="Усього пунктів" tone="orange" />
        </section>

        <section className="toolbar">
          <label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Знайти майданчик..." /></label>
          <div className="filters">
            {(["all", "planned", "in_progress", "done", "problem"] as const).map((value) =>
              <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "Усі" : statusLabels[value]}</button>
            )}
          </div>
        </section>

        <section className="roadmap">
          {groups.map((level) => {
            const groupItems = visible.filter((item) => item.level === level);
            return (
              <div className="level" key={level}>
                <div className="level-heading"><span>0{level}</span><div><p>РІВЕНЬ {level}</p><h2>{groupItems[0]?.category}</h2></div><i>{groupItems.length} пунктів</i></div>
                <div className="cards">
                  {groupItems.map((item) => <RoadmapCard key={item.id} item={item} onChange={(patch) => updateItem(item.id, patch)} />)}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

const initialHealth: SupabaseHealth = {
  status: "checking",
  latency: null,
  httpStatus: null,
  project: "Supabase",
  checkedAt: null,
  message: "Перевіряємо з’єднання…",
};

function DatabaseBeacon() {
  const [health, setHealth] = useState(initialHealth);
  const [open, setOpen] = useState(false);

  const check = async () => {
    setHealth((current) => ({ ...current, status: "checking", message: "Перевіряємо з’єднання…" }));
    setHealth(await checkSupabaseHealth());
  };

  useEffect(() => {
    void check();
  }, []);

  const label = health.status === "online" ? "База доступна" : health.status === "offline" ? "База недоступна" : "Перевірка бази";

  return (
    <div className={`db-beacon ${open ? "open" : ""}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="db-trigger" onClick={() => setOpen((value) => !value)} aria-label={label} aria-expanded={open}>
        <span className={health.status} />
      </button>
      <div className="db-popover" role="status">
        <div className="db-popover-head">
          <span className={`db-status-dot ${health.status}`} />
          <div><b>{label}</b><small>{health.message}</small></div>
        </div>
        <dl>
          <div><dt>Env URL</dt><dd title={supabaseDebug.url}>{supabaseDebug.url}</dd></div>
          <div><dt>Ключ</dt><dd>{supabaseDebug.hasKey ? `є · ${supabaseDebug.keyLength} симв.` : "відсутній"}</dd></div>
          <div><dt>Префікс</dt><dd>{supabaseDebug.keyPrefix}</dd></div>
          <div><dt>Endpoint</dt><dd title={supabaseDebug.endpoint}>{supabaseDebug.endpoint}</dd></div>
          <div><dt>Проєкт</dt><dd>{health.project}</dd></div>
          <div><dt>Затримка</dt><dd>{health.latency === null ? "—" : `${health.latency} мс`}</dd></div>
          <div><dt>HTTP</dt><dd>{health.httpStatus ?? "—"}</dd></div>
          <div><dt>Build</dt><dd title={supabaseDebug.buildTimestamp}>{supabaseDebug.buildTimestamp === "local-dev" ? "local-dev" : new Date(supabaseDebug.buildTimestamp).toLocaleString("uk-UA")}</dd></div>
          <div><dt>Перевірено</dt><dd>{health.checkedAt ? new Date(health.checkedAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}</dd></div>
        </dl>
        <button className="db-recheck" onClick={() => void check()} disabled={health.status === "checking"}>Перевірити ще раз</button>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  return <article className={`stat ${tone}`}><span>{icon}</span><div><b>{value}</b><p>{label}</p></div></article>;
}

function RoadmapCard({ item, onChange }: { item: RoadmapItem; onChange: (patch: Partial<RoadmapItem>) => void }) {
  const placementUrl = item.targetUrl.trim();
  const externalUrl = /^https?:\/\//i.test(placementUrl) ? placementUrl : `https://${placementUrl}`;

  return (
    <article className={`card status-${item.status}`}>
      <div className="card-top"><span className="number">{String(item.id).padStart(2, "0")}</span><span className={`priority ${item.priority}`}>{item.priority === "high" ? "ВИСОКИЙ" : item.priority === "medium" ? "СЕРЕДНІЙ" : "НИЗЬКИЙ"}</span></div>
      <h3>{item.title}</h3>
      <div className="metrics"><span>SEO <b>{"●".repeat(item.seoValue)}</b></span><span>Складність <b>{"●".repeat(item.difficulty)}</b></span></div>
      <select value={item.status} onChange={(event) => onChange({ status: event.target.value as RoadmapStatus })}>
        {Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
      <div className="url-field">
        <input className="url" value={item.targetUrl} onChange={(event) => onChange({ targetUrl: event.target.value })} placeholder="URL розміщення" />
        {placementUrl && (
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Відкрити ${item.title} у новій вкладці`} title="Відкрити у новій вкладці">
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <textarea value={item.notes} onChange={(event) => onChange({ notes: event.target.value })} placeholder="Додати нотатку..." rows={2} />
    </article>
  );
}
