"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Sparkles } from "lucide-react";
import { companyInfoBlocks, type CompanyInfoBlock } from "@/data/companyInfo";
import { DirectoryCredentialsPanel } from "./DirectoryCredentialsPanel";

export function CompanyInfoLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = async (block: CompanyInfoBlock) => {
    await navigator.clipboard.writeText(block.content);
    setCopiedId(block.id);
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
            <Link href="/company" className="active">Company Info</Link>
          </nav>
        </div>
        <span className="company-ready">{companyInfoBlocks.length} готових блоків</span>
      </header>

      <div className="company-shell">
        <section className="company-hero">
          <div><p className="eyebrow">CONTENT LIBRARY</p><h1>Інформація<br /><span>про компанію</span></h1></div>
          <p>Структуровані тексти для каталогів, профілів, оголошень і створення нового контенту. Кожен блок копіюється одним кліком.</p>
        </section>

        <DirectoryCredentialsPanel />

        <section className="company-grid">
          {companyInfoBlocks.map((block) => (
            <article className={`info-card ${block.featured ? "featured" : ""}`} key={block.id}>
              <header>
                <div><h2>{block.title}</h2><p>{block.hint}</p></div>
                <button className={copiedId === block.id ? "copied" : ""} onClick={() => void copy(block)} aria-label={`Скопіювати: ${block.title}`} title="Скопіювати">
                  {copiedId === block.id ? <Check size={15} /> : <Copy size={14} />}
                </button>
              </header>
              {block.type === "list" ? (
                <ul>{block.content.split("\n").filter(Boolean).map((line) => <li key={line}>{line}</li>)}</ul>
              ) : block.type === "keywords" ? (
                <div className="keyword-cloud">{block.content.split("\n").map((word) => <span key={word}>{word}</span>)}</div>
              ) : (
                <p className="info-content">{block.content}</p>
              )}
              {block.id === "website" && <a className="info-open-link" href={block.content} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} />Відкрити сайт</a>}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
