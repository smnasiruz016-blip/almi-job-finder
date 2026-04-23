import type { CoverLetterData, CoverLetterTemplateConfig } from "@/types/documents";

type CoverLetterPreviewProps = {
  template: CoverLetterTemplateConfig;
  data: CoverLetterData;
};

export function CoverLetterPreview({ template, data }: CoverLetterPreviewProps) {
  const isModern = template.layout.mode === "modern-letter";

  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <div
          className="px-8 py-7"
          style={{
            background: isModern
              ? `linear-gradient(135deg, ${template.theme.accent} 0%, ${template.theme.muted} 100%)`
              : template.theme.surface
          }}
        >
          <p
            className="font-[family-name:var(--font-display)] text-3xl font-semibold"
            style={{ color: isModern ? "#ffffff" : template.theme.text }}
          >
            {data.jobTitle || "Cover letter title"}
          </p>
          <p className="mt-2 text-sm" style={{ color: isModern ? "rgba(255,255,255,0.82)" : template.theme.muted }}>
            {[data.company || "Company", data.hiringManager].filter(Boolean).join(" | ")}
          </p>
        </div>

        <div className="space-y-6 px-8 py-8 text-sm leading-8 text-slate-700">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: template.theme.accent }}>
              Introduction
            </p>
            <p>{data.intro || "Write a short introduction that explains why this role matters to you."}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: template.theme.accent }}>
              Body
            </p>
            <p>{data.body || "Use the body to connect your experience, strengths, and results to the role you want."}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: template.theme.accent }}>
              Closing
            </p>
            <p>{data.closing || "Close with confidence and make it easy for the employer to continue the conversation."}</p>
          </div>

          {template.layout.showSignatureLine ? <div className="h-px w-32 bg-slate-300" /> : null}
        </div>
      </div>
    </div>
  );
}
