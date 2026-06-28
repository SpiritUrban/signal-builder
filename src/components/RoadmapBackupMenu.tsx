"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, DatabaseBackup, Download, LoaderCircle, Upload } from "lucide-react";
import { createRoadmapBackup, parseRoadmapBackup } from "@/lib/roadmapBackup";
import { restoreRoadmapItems } from "@/lib/roadmapRepository";
import type { RoadmapItem } from "@/lib/types";

export function RoadmapBackupMenu({ items, onRestored }: { items: RoadmapItem[]; onRestored: (items: RoadmapItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const download = () => {
    const backup = createRoadmapBackup(items);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-transfer-roadmap-${backup.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const restore = async (file: File) => {
    try {
      const backup = parseRoadmapBackup(await file.text());
      if (!window.confirm(`Відновити ${backup.itemCount} карток зі backup від ${new Date(backup.exportedAt).toLocaleString("uk-UA")}?\n\nПоточні статуси, URL і нотатки в базі буде перезаписано.`)) return;
      setRestoring(true);
      const restored = await restoreRoadmapItems(backup.items);
      onRestored(restored);
      setOpen(false);
      window.alert(`Успішно відновлено ${restored.length} карток.`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Не вдалося відновити backup.");
    } finally {
      setRestoring(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`backup-menu ${open ? "open" : ""}`} ref={menuRef}>
      <button className="backup-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Backup та відновлення">
        <DatabaseBackup size={15} /><ChevronDown size={12} />
      </button>
      <div className="backup-dropdown">
        <div><b>Roadmap backup</b><small>{items.length} карток у поточному стані</small></div>
        <button onClick={download}><Download size={14} /><span><b>Скачати JSON backup</b><small>Для архіву та аналізу ШІ</small></span></button>
        <button onClick={() => inputRef.current?.click()} disabled={restoring}>
          {restoring ? <LoaderCircle className="spin" size={14} /> : <Upload size={14} />}
          <span><b>Відновити з JSON</b><small>Перезаписати стан у Supabase</small></span>
        </button>
        <input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void restore(file);
        }} />
      </div>
    </div>
  );
}
