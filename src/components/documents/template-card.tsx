import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import type { CoverLetterTemplateConfig, ResumeTemplateConfig } from "@/types/documents";
import { TemplatePreviewThumbnail } from "@/components/documents/template-preview-thumbnail";
import { getTemplatePresentation } from "@/lib/template-presentation";

type TemplateCardProps = {
  template: ResumeTemplateConfig | CoverLetterTemplateConfig;
  href: Route;
  premiumLocked?: boolean;
};

export function TemplateCard({ template, href, premiumLocked = false }: TemplateCardProps) {
  const isPremium = template.metadata.tier === "PREMIUM";
  const presentation = getTemplatePresentation(template);

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_22px_90px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_110px_rgba(15,23,42,0.14)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-40 opacity-80 transition duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(180deg, ${template.theme.accentSoft} 0%, rgba(255,255,255,0) 100%)`
        }}
      />
      <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/50 blur-2xl" />
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{presentation.familyLabel}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">
              {template.metadata.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {presentation.layoutLabel}
              </span>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ background: template.theme.accentSoft, color: template.theme.text }}
              >
                {presentation.tone}
              </span>
            </div>
          </div>
          {isPremium ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
              <LockKeyhole className="h-3.5 w-3.5" />
              Premium
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: template.theme.accent }}>
              <Sparkles className="h-3.5 w-3.5" />
              Free
            </span>
          )}
        </div>
        <div className="relative">
          <TemplatePreviewThumbnail template={template} />
          <div className="pointer-events-none absolute inset-x-6 bottom-4 flex items-center justify-between rounded-full border border-white/60 bg-white/80 px-3 py-2 backdrop-blur">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {template.metadata.kind === "resume" ? "CV direction" : "Letter tone"}
            </span>
            <span className="text-xs font-semibold" style={{ color: template.theme.accent }}>
              {template.metadata.kind === "resume" ? "Live preview ready" : "Fast draft ready"}
            </span>
          </div>
        </div>
      </div>
      <div className="relative mt-5 flex flex-1 flex-col">
        <p className="text-sm font-medium uppercase tracking-[0.18em]" style={{ color: template.theme.accent }}>
          {template.metadata.previewLabel}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{template.metadata.description}</p>
        <div className="mt-4 grid gap-3 rounded-[1.35rem] border border-slate-200/80 bg-slate-50/85 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Best for</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{presentation.audience}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Layout</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{presentation.layoutLabel}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tone</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{presentation.tone}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Visible sections</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {template.visibleSections.slice(0, 4).map((section) => (
            <span
              key={section}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: template.theme.accentSoft,
                color: template.theme.text
              }}
            >
              {section.replace(/-/g, " ")}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-white/85 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Ready for</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {template.metadata.kind === "resume" ? "Live editing and polished export" : "Quick matching cover letters"}
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold transition group-hover:translate-x-0.5"
            style={{ color: premiumLocked ? "#7c3aed" : template.theme.accent }}
          >
            {premiumLocked ? "Upgrade" : "Use template"}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
