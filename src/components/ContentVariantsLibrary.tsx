"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Sparkles } from "lucide-react";
import { contentVariants } from "@/data/contentVariants";

export function ContentVariantsLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copyVariant = async (id: string, title: string, content: string) => {
    await navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopiedId(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <main>
      <header className="topbar">
        <div className="topbar-left">
          <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>MY TRANSFER</span></Link>
          <nav className="main-nav" aria-label="Основна навігація">
            <Link href="/">Roadmap</Link>
            <Link href="/company">Company Info</Link>
            <Link href="/content" className="active">Content</Link>
          </nav>
        </div>
        <span className="company-ready">{contentVariants.length} варіант</span>
      </header>

      <div className="content-shell">
        <section className="company-hero">
          <div><p className="eyebrow">CONTENT VARIANTS</p><h1>Варіанти<br /><span>контенту</span></h1></div>
          <p>Готові тексти для публікацій. Кнопка на картці копіює заголовок і весь допис одним кліком.</p>
        </section>

        <section className="content-grid">
          {contentVariants.map((variant) => (
            <article className="content-card" key={variant.id}>
              <header>
                <div><p>Готовий допис</p><h2>{variant.title}</h2></div>
                <button
                  type="button"
                  className={copiedId === variant.id ? "copied" : ""}
                  onClick={() => void copyVariant(variant.id, variant.copyTitle ?? variant.title, variant.content)}
                  aria-label={`Скопіювати: ${variant.title}`}
                  title="Скопіювати заголовок і текст"
                >
                  {copiedId === variant.id ? <Check size={16} /> : <Copy size={15} />}
                </button>
              </header>
              <div className="content-card-body">{variant.content}</div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
