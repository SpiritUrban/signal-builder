"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, CheckCircle2, CircleDashed, ExternalLink, LoaderCircle, RefreshCw, Search, Sparkles, Target, Zap } from "lucide-react";
import { initialRoadmap } from "@/data/initialRoadmap";
import { loadRoadmapItems, mergeRoadmapRow, saveRoadmapItem, subscribeToRoadmapChanges } from "@/lib/roadmapRepository";
import { checkSupabaseHealth, supabaseDebug, type SupabaseHealth } from "@/lib/supabase";
import type { CardSaveState, RoadmapItem, RoadmapStatus } from "@/lib/types";

const statusLabels: Record<RoadmapStatus, string> = {
  planned: "Заплановано",
  in_progress: "В роботі",
  done: "Готово",
  skipped: "Пропущено",
  problem: "Проблема",
};

export function RoadmapDashboard() {
  const [items, setItems] = useState<RoadmapItem[]>(initialRoadmap);
  const [saveStates, setSaveStates] = useState<Record<number, CardSaveState>>({});
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RoadmapStatus | "all">("all");
  const itemsRef = useRef(items);
  const saveStatesRef = useRef(saveStates);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const revisionsRef = useRef(new Map<number, number>());

  const setCardSaveState = useCallback((id: number, state: CardSaveState) => {
    const next = { ...saveStatesRef.current, [id]: state };
    saveStatesRef.current = next;
    setSaveStates(next);
  }, []);

  const persistItem = useCallback(async function persist(
    id: number,
    attempt = 1,
    revision = revisionsRef.current.get(id) ?? 0,
  ) {
    if ((revisionsRef.current.get(id) ?? 0) !== revision) return;
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (!item) return;

    setCardSaveState(id, { status: "saving", attempt });
    try {
      const row = await saveRoadmapItem(item);
      if ((revisionsRef.current.get(id) ?? 0) !== revision) return;
      const next = itemsRef.current.map((current) => current.id === id ? mergeRoadmapRow(current, row) : current);
      itemsRef.current = next;
      setItems(next);
      setCardSaveState(id, { status: "saved", attempt });
    } catch {
      if ((revisionsRef.current.get(id) ?? 0) !== revision) return;
      if (attempt < 3) {
        setCardSaveState(id, { status: "saving", attempt: attempt + 1 });
        const timer = setTimeout(() => void persist(id, attempt + 1, revision), attempt * 1000);
        timersRef.current.set(id, timer);
      } else {
        setCardSaveState(id, { status: "error", attempt });
      }
    }
  }, [setCardSaveState]);

  useEffect(() => {
    let active = true;
    const timers = timersRef.current;

    void loadRoadmapItems()
      .then((loaded) => {
        if (!active) return;
        itemsRef.current = loaded;
        setItems(loaded);
        setLoadError("");
      })
      .catch(() => {
        if (active) setLoadError("Не вдалося завантажити roadmap із Supabase.");
      });

    const unsubscribe = subscribeToRoadmapChanges((row) => {
      if (!active) return;
      const localStatus = saveStatesRef.current[row.id]?.status ?? "idle";
      if (localStatus === "pending" || localStatus === "saving" || localStatus === "error") return;
      const next = itemsRef.current.map((item) => item.id === row.id ? mergeRoadmapRow(item, row) : item);
      itemsRef.current = next;
      setItems(next);
      setCardSaveState(row.id, { status: "saved", attempt: 1 });
    });

    return () => {
      active = false;
      unsubscribe();
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [setCardSaveState]);

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
  const updateItem = useCallback((id: number, patch: Partial<RoadmapItem>) => {
    const next = itemsRef.current.map((item) => item.id === id ? { ...item, ...patch } : item);
    itemsRef.current = next;
    setItems(next);

    const revision = (revisionsRef.current.get(id) ?? 0) + 1;
    revisionsRef.current.set(id, revision);
    setCardSaveState(id, { status: "pending", attempt: 0 });

    const existingTimer = timersRef.current.get(id);
    if (existingTimer) clearTimeout(existingTimer);
    const timer = setTimeout(() => void persistItem(id, 1, revision), 3000);
    timersRef.current.set(id, timer);
  }, [persistItem, setCardSaveState]);

  const retryItem = useCallback((id: number) => {
    const revision = revisionsRef.current.get(id) ?? 0;
    void persistItem(id, 1, revision);
  }, [persistItem]);

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>MY TRANSFER</span><em>Roadmap</em></div>
        <div className="top-progress"><span>{stats.progress}% виконано</span><div><i style={{ width: `${stats.progress}%` }} /></div></div>
        <DatabaseBeacon />
      </header>

      <div className="shell">
        {loadError && <div className="sync-error-banner"><AlertCircle size={15} />{loadError}</div>}
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
                  {groupItems.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      saveState={saveStates[item.id] ?? { status: "idle", attempt: 0 }}
                      onChange={(patch) => updateItem(item.id, patch)}
                      onRetry={() => retryItem(item.id)}
                    />
                  ))}
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
          <div><dt>Build</dt><dd title={supabaseDebug.buildTimestamp}>{supabaseDebug.buildTimestamp}</dd></div>
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

function RoadmapCard({
  item,
  saveState,
  onChange,
  onRetry,
}: {
  item: RoadmapItem;
  saveState: CardSaveState;
  onChange: (patch: Partial<RoadmapItem>) => void;
  onRetry: () => void;
}) {
  const placementUrl = item.targetUrl.trim();
  const externalUrl = /^https?:\/\//i.test(placementUrl) ? placementUrl : `https://${placementUrl}`;
  const saveLabel = {
    idle: "Без змін",
    pending: "Є незбережені зміни",
    saving: `Збереження · спроба ${saveState.attempt}/3`,
    saved: "Збережено у Supabase",
    error: "Не вдалося зберегти · натисніть, щоб повторити",
  }[saveState.status];

  return (
    <article className={`card status-${item.status}`}>
      <div className="card-top">
        <span className="number">{String(item.id).padStart(2, "0")}</span>
        <div className="card-signals">
          {saveState.status !== "idle" && (
            <button
              className={`save-signal ${saveState.status}`}
              onClick={saveState.status === "error" ? onRetry : undefined}
              disabled={saveState.status !== "error"}
              title={saveLabel}
              aria-label={saveLabel}
            >
              {saveState.status === "saving" && <LoaderCircle size={12} />}
              {saveState.status === "saved" && <Check size={12} />}
              {saveState.status === "error" && <RefreshCw size={11} />}
            </button>
          )}
          <span className={`priority ${item.priority}`}>{item.priority === "high" ? "ВИСОКИЙ" : item.priority === "medium" ? "СЕРЕДНІЙ" : "НИЗЬКИЙ"}</span>
        </div>
      </div>
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
