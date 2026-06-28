"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import companyProfile from "@/data/companyProfile.json";

interface Field {
  label: string;
  value: string;
}

const blank = "";
const basicFields: Field[] = [
  { label: "Назва компанії", value: companyProfile.company.name },
  { label: "Юридична назва", value: companyProfile.company.legalName },
  { label: "NIP", value: companyProfile.company.taxId },
  { label: "Сайт", value: companyProfile.company.website },
  { label: "Email", value: companyProfile.company.email },
  { label: "Телефон", value: companyProfile.company.phone },
  { label: "Телефон (міжнародний)", value: companyProfile.company.phone },
];
const addressFields: Field[] = [
  { label: "Країна", value: companyProfile.address.country },
  { label: "Місто", value: companyProfile.address.city },
  { label: "Область / Регіон", value: companyProfile.address.region },
  { label: "Поштовий індекс", value: companyProfile.address.postalCode },
  { label: "Адреса рядок 1", value: companyProfile.address.addressLine1 },
  { label: "Адреса рядок 2", value: companyProfile.address.addressLine2 },
];
const legalFields: Field[] = [
  { label: "Власник", value: companyProfile.legal.owner },
  { label: "Юридична назва", value: companyProfile.legal.legalName },
  { label: "Країна реєстрації", value: companyProfile.legal.registrationCountry },
  { label: "Місто реєстрації", value: companyProfile.legal.registrationCity },
  { label: "Юридична адреса", value: companyProfile.legal.legalAddress },
  { label: "Поштовий індекс", value: companyProfile.legal.postalCode },
  { label: "Податковий номер (NIP)", value: companyProfile.legal.nip },
  { label: "Номер ліцензії", value: companyProfile.legal.licenseNumber },
  { label: "Тип ліцензії", value: companyProfile.legal.licenseType },
  { label: "Дата видачі ліцензії", value: companyProfile.legal.licenseIssued },
  { label: "Ліцензія дійсна до", value: companyProfile.legal.licenseValidUntil },
];
const contactPersonFields: Field[] = [
  { label: "Ім'я", value: companyProfile.contactPerson.firstName },
  { label: "Прізвище", value: companyProfile.contactPerson.lastName },
  { label: "Посада", value: companyProfile.contactPerson.role },
  { label: "Email", value: companyProfile.contactPerson.email },
  { label: "Телефон", value: companyProfile.contactPerson.phone },
];
const appleFields: Field[] = [
  { label: "Organization Name", value: companyProfile.company.name },
  { label: "Business Email", value: companyProfile.company.email },
  { label: "Website", value: companyProfile.company.website },
  { label: "Country", value: companyProfile.address.country },
  { label: "Address Line 1", value: companyProfile.address.addressLine1 },
  { label: "Address Line 2", value: companyProfile.address.addressLine2 },
  { label: "City", value: companyProfile.address.city },
  { label: "State / Region", value: companyProfile.address.region },
  { label: "Postal Code", value: companyProfile.address.postalCode },
];
const socialFields: Field[] = Object.entries(companyProfile.social).map(([label, value]) => ({
  label: label.charAt(0).toUpperCase() + label.slice(1),
  value,
}));
const businessFields: Field[] = [
  { label: "Категорії бізнесу", value: companyProfile.categories.join(", ") },
  { label: "Графік роботи", value: companyProfile.operations.workingHours },
  { label: "Працює 24/7", value: companyProfile.operations.alwaysOpen ? "Так" : "Ні" },
  { label: "Мови обслуговування", value: companyProfile.operations.serviceLanguages.join(", ") },
  { label: "Країни роботи", value: companyProfile.operations.countries.join(", ") },
];

export function DirectoryCredentialsPanel() {
  const [copied, setCopied] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copyValue = async (key: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(""), 1500);
  };

  return (
    <section className="directory-section">
      <div className="directory-heading">
        <div><p className="eyebrow">QUICK ACCESS</p><h2>Реквізити для каталогів</h2></div>
        <p>Еталонні дані для business listings і citation building.</p>
      </div>
      <div className="directory-grid">
        <CredentialCard title="Основна інформація" fields={basicFields} copied={copied} onCopy={copyValue} />
        <CredentialCard title="Юридична інформація" fields={legalFields} copied={copied} onCopy={copyValue} emphasized note="Високий пріоритет · ліцензія та реєстраційні дані" />
        <CredentialCard title="Контактна особа" fields={contactPersonFields} copied={copied} onCopy={copyValue} />
        <CredentialCard title="Адреса" fields={addressFields} copied={copied} onCopy={copyValue} />
        <CredentialCard title="Дані для Apple Business" fields={appleFields} copied={copied} onCopy={copyValue} />
        <CredentialCard title="NAP · Citation Reference" fields={[
          { label: "Name", value: companyProfile.company.name },
          { label: "Address", value: [companyProfile.address.addressLine1, companyProfile.address.city, companyProfile.address.postalCode, companyProfile.address.country].filter(Boolean).join(", ") || blank },
          { label: "Phone", value: companyProfile.company.phone },
        ]} copied={copied} onCopy={copyValue} emphasized note="Використовувати без змін у всіх каталогах та бізнес-профілях." />
        <CredentialCard title="Соцмережі" fields={socialFields} copied={copied} onCopy={copyValue} />
        <CredentialCard title="Бізнес" fields={businessFields} copied={copied} onCopy={copyValue} />
      </div>
    </section>
  );
}

function CredentialCard({ title, fields, copied, onCopy, emphasized = false, note }: {
  title: string;
  fields: Field[];
  copied: string;
  onCopy: (key: string, value: string) => Promise<void>;
  emphasized?: boolean;
  note?: string;
}) {
  return (
    <article className={`directory-card ${emphasized ? "emphasized" : ""}`}>
      <header><div><h3>{title}</h3>{note && <p>{note}</p>}</div></header>
      <dl>{fields.map((field) => {
        const key = `${title}-${field.label}`;
        return <div key={field.label}><dt>{field.label}</dt><dd className={!field.value ? "empty" : ""}>{field.value || "Не вказано"}</dd><button disabled={!field.value} onClick={() => void onCopy(key, field.value)} aria-label={`Скопіювати ${field.label}`}>{copied === key ? <Check size={12} /> : <Copy size={11} />}</button></div>;
      })}</dl>
    </article>
  );
}
