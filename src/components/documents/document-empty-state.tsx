import Link from "next/link";
import type { Route } from "next";
import { FilePlus2 } from "lucide-react";

type DocumentEmptyStateProps = {
  title: string;
  description: string;
  href: Route;
  ctaLabel: string;
};

export function DocumentEmptyState({ title, description, href, ctaLabel }: DocumentEmptyStateProps) {
  return (
    <div className="glass-panel rounded-[2rem] border border-dashed border-slate-200 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <FilePlus2 className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
