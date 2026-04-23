import { cn } from "@/lib/utils";
import type { CoverLetterTemplateConfig, ResumeTemplateConfig } from "@/types/documents";

type TemplatePreviewThumbnailProps = {
  template: ResumeTemplateConfig | CoverLetterTemplateConfig;
};

const mockResumeIdentity = {
  name: "Amina Rahman",
  title: "Product Designer",
  location: "Reykjavik, Iceland",
  contact: ["aminarahman@email.com", "+354 555 2100", "aminarahman.design"],
  summary:
    "Designing calm, conversion-focused experiences across product, brand, and growth surfaces.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "North Studio",
      period: "2024 - Present"
    },
    {
      role: "Product Designer",
      company: "Luma Digital",
      period: "2021 - 2024"
    }
  ],
  education: "B.A. Design Systems, University of Copenhagen",
  skills: ["Figma", "UX Writing", "Research", "Design Systems"],
  projects: ["Growth dashboard redesign", "Mobile onboarding refresh"],
  certifications: ["Product Strategy", "Accessibility Basics"]
};

const mockCoverLetterIdentity = {
  name: "Amina Rahman",
  intro: "Dear Hiring Team,",
  role: "Product Designer",
  company: "North Studio",
  closing: "Thank you for your time and consideration."
};

function isResumeTemplate(
  template: ResumeTemplateConfig | CoverLetterTemplateConfig
): template is ResumeTemplateConfig {
  return template.metadata.kind === "resume";
}

function SectionHeading({
  label,
  accent
}: {
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
    </div>
  );
}

function ResumeTemplatePreview({ template }: { template: ResumeTemplateConfig }) {
  const hasSidebar = template.layout.mode === "two-column" || template.layout.mode === "header-accent";
  const showPhoto = template.layout.showPhoto;
  const isCreative = template.family === "CREATIVE_PORTFOLIO";
  const isBold = template.family === "BOLD_STARTUP";
  const isAcademic = template.family === "ACADEMIC_CLEAN";
  const isCompact = template.family === "COMPACT_ONE_PAGE";
  const isMinimal = template.family === "MINIMAL_ATS";
  const isModern = template.family === "MODERN_PROFESSIONAL";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.65rem] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
        isBold && "border border-white/12",
        isCreative && "border border-white/20",
        isAcademic && "border border-white/35"
      )}
      style={{
        background: isBold
          ? `linear-gradient(145deg, ${template.theme.text} 0%, ${template.theme.accent} 100%)`
          : isCreative
            ? `linear-gradient(145deg, ${template.theme.accentSoft} 0%, rgba(255,255,255,0.96) 58%, ${template.theme.accentSoft} 100%)`
            : isAcademic
              ? `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, ${template.theme.accentSoft} 100%)`
              : `linear-gradient(145deg, ${template.theme.accent} 0%, ${template.theme.muted} 100%)`
      }}
    >
      <div className="absolute inset-x-0 top-0 h-16 opacity-30" style={{ background: template.theme.accentSoft }} />
      <div
        className={cn(
          "absolute inset-y-0 opacity-50",
          hasSidebar ? "left-0 w-[28%]" : "right-0 w-24"
        )}
        style={{
          background: hasSidebar
            ? `linear-gradient(180deg, ${template.theme.accentSoft} 0%, rgba(255,255,255,0) 100%)`
            : `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${template.theme.accentSoft} 100%)`
        }}
      />
      {isBold ? (
        <div className="absolute right-5 top-5 h-28 w-28 rounded-full border border-white/15 bg-white/8 blur-[2px]" />
      ) : null}
      {isCreative ? (
        <>
          <div className="absolute left-4 top-6 h-10 w-10 rounded-full border border-white/50 bg-white/40" />
          <div className="absolute right-8 top-10 h-12 w-12 rounded-[1.2rem] border border-white/40 bg-white/25" />
        </>
      ) : null}
      <div
        className={cn(
          "relative rounded-[1.45rem] bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]",
          isBold && "bg-white/94",
          isCreative && "bg-white/92"
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: template.theme.accent }} />
            {template.metadata.previewLabel}
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-1.5 rounded-full bg-slate-200"
                style={{ width: `${index === 0 ? 18 : 8}px` }}
              />
            ))}
          </div>
        </div>
        <div className={cn("mb-4", isCompact ? "space-y-3" : "space-y-4")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {showPhoto ? (
                <div
                  className={cn(
                    "shrink-0 rounded-full border-4 border-white/80 shadow-sm",
                    isCompact ? "h-10 w-10" : "h-12 w-12"
                  )}
                  style={{ background: template.theme.accentSoft }}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      background: `radial-gradient(circle at 40% 30%, rgba(255,255,255,0.85), ${template.theme.accent} 80%)`
                    }}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <div
                  className={cn(
                    "font-semibold leading-none tracking-[-0.02em]",
                    isCompact ? "text-sm" : "text-[15px]"
                  )}
                  style={{ color: template.theme.text }}
                >
                  {mockResumeIdentity.name}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {mockResumeIdentity.title}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              {mockResumeIdentity.contact.slice(0, 2).map((item) => (
                <div key={item} className="text-[9px] leading-none text-slate-400">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {template.layout.mode === "header-accent" ? (
            <div className="rounded-2xl px-3 py-3" style={{ background: template.theme.accentSoft }}>
              <SectionHeading label="Profile" accent={template.theme.accent} />
              <p className="mt-2 text-[10px] leading-4 text-slate-600">{mockResumeIdentity.summary}</p>
            </div>
          ) : null}
        </div>

        <div className={cn("grid gap-3", hasSidebar ? "grid-cols-[0.72fr_1.28fr]" : "grid-cols-1")}>
          {hasSidebar ? (
            <div
              className={cn(
                "space-y-3 rounded-[1.2rem] p-3",
                isBold ? "bg-slate-950/6" : "bg-slate-50/80"
              )}
            >
              <SectionHeading label="Contact" accent={template.theme.accent} />
              <div className="space-y-1.5 text-[9px] text-slate-500">
                {mockResumeIdentity.contact.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
              <div className="space-y-2">
                <SectionHeading label="Skills" accent={template.theme.accent} />
                <div className="space-y-1.5">
                  {mockResumeIdentity.skills.slice(0, 3).map((skill, index) => (
                    <div key={skill} className="space-y-1">
                      <div className="text-[9px] text-slate-500">{skill}</div>
                      <div className="h-1.5 rounded-full bg-white/85">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${88 - index * 15}%`,
                            background: index === 0 ? template.theme.accent : template.theme.accentSoft
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {isCompact ? null : (
                  <>
                    <SectionHeading label="Education" accent={template.theme.accent} />
                    <p className="text-[9px] leading-4 text-slate-500">{mockResumeIdentity.education}</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <SectionHeading label="Strengths" accent={template.theme.accent} />
                <div className="flex flex-wrap gap-1.5">
                  {["UX", "Growth", "Research"].map((tag, index) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        background: index === 0 ? template.theme.accentSoft : "rgba(148,163,184,0.14)",
                        color: template.theme.text
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {isCreative ? (
                <div className="space-y-2">
                  <SectionHeading label="Selected work" accent={template.theme.accent} />
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-xl"
                        style={{ background: index === 1 ? template.theme.accentSoft : "rgba(255,255,255,0.85)" }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <SectionHeading label="Experience" accent={template.theme.accent} />
              {!isMinimal ? <span className="text-[9px] uppercase tracking-[0.16em] text-slate-400">{mockResumeIdentity.location}</span> : null}
            </div>
            <div
              className={cn(
                "rounded-[1.2rem] p-3",
                isAcademic ? "border border-slate-200 bg-white" : "bg-slate-50/85"
              )}
            >
              <div className="space-y-3">
                {mockResumeIdentity.experience.map((item) => (
                  <div key={item.role} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold leading-none" style={{ color: template.theme.text }}>
                        {item.role}
                      </p>
                      <span className="text-[8px] uppercase tracking-[0.16em] text-slate-400">{item.period}</span>
                    </div>
                    <p className="text-[9px] leading-none text-slate-500">{item.company}</p>
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-slate-200" />
                      <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {isModern ? (
              <div className="rounded-[1.1rem] border border-slate-200/80 bg-white/80 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <SectionHeading label="Highlights" accent={template.theme.accent} />
                  <div className="rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em]" style={{ background: template.theme.accentSoft, color: template.theme.text }}>
                    Featured
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {mockResumeIdentity.projects.slice(0, 2).map((project) => (
                    <div key={project} className="rounded-2xl bg-slate-50 p-2">
                      <div className="text-[9px] font-medium text-slate-600">{project}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-[1.1rem] bg-slate-50/85 p-3">
                <SectionHeading label="Projects" accent={template.theme.accent} />
                <div className="mt-2 space-y-1.5">
                  {mockResumeIdentity.projects.map((project) => (
                    <div key={project} className="text-[9px] leading-4 text-slate-500">
                      {project}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.1rem] bg-slate-50/85 p-3">
                <SectionHeading label="Certifications" accent={template.theme.accent} />
                <div className="mt-2 space-y-1.5">
                  {mockResumeIdentity.certifications.map((item) => (
                    <div key={item} className="text-[9px] leading-4 text-slate-500">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {!isCompact ? (
              <div className="rounded-[1.1rem] bg-slate-50/85 p-3">
                <SectionHeading label="Core skills" accent={template.theme.accent} />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {mockResumeIdentity.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {isAcademic ? (
              <div className="rounded-[1.1rem] border border-slate-200/90 bg-white p-3">
                <div className="flex items-center gap-2">
                  <SectionHeading label="Education timeline" accent={template.theme.accent} />
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="mt-2 space-y-2">
                  {[mockResumeIdentity.education, "UX Research Methods", "Visual Communication"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100" />
                      <div className="space-y-1.5">
                        <div className="text-[9px] leading-4 text-slate-500">{item}</div>
                        <div className="h-1.5 w-16 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverLetterTemplatePreview({ template }: { template: CoverLetterTemplateConfig }) {
  const isBold = template.family === "BOLD_CONTEMPORARY";
  const isMinimal = template.family === "MINIMAL_ATS";
  const isModern = template.family === "MODERN_CLEAN";

  return (
    <div
      className="relative overflow-hidden rounded-[1.65rem] p-4"
      style={{
        background: `linear-gradient(150deg, ${template.theme.accent} 0%, ${template.theme.muted} 100%)`
      }}
    >
      <div className="absolute -right-8 top-5 h-24 w-24 rounded-full opacity-30" style={{ background: template.theme.accentSoft }} />
      {isBold ? <div className="absolute left-4 top-4 h-16 w-16 rounded-[1.3rem] bg-white/20" /> : null}
      <div className="relative rounded-[1.45rem] bg-white/96 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: template.theme.accent }} />
            {template.metadata.previewLabel}
          </div>
          <div className="h-6 w-14 rounded-full" style={{ background: template.theme.accentSoft }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="text-[13px] font-semibold leading-none" style={{ color: template.theme.text }}>
              {mockCoverLetterIdentity.name}
            </div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
              {mockCoverLetterIdentity.role}
            </div>
          </div>
          <div className="space-y-1.5 text-right">
            <div className="text-[9px] text-slate-400">{mockCoverLetterIdentity.company}</div>
            <div className="text-[9px] text-slate-400">Reykjavik, Iceland</div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: template.theme.accent }}>
            {mockCoverLetterIdentity.intro}
          </div>
          <div className="space-y-1.5">
            <div className="text-[9px] leading-4 text-slate-500">
              I am applying for the {mockCoverLetterIdentity.role} role with a calm mix of product thinking, craft, and
              communication.
            </div>
            <div className="text-[9px] leading-4 text-slate-500">
              I have led design work across onboarding, growth, and structured product surfaces while staying close to
              collaboration and outcomes.
            </div>
          </div>
          {isModern ? <div className="h-px w-full" style={{ background: template.theme.accentSoft }} /> : null}
          <div className="h-px w-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="text-[9px] leading-4 text-slate-500">
              I would be glad to bring thoughtful design execution, structure, and a strong user-centered approach to your
              team.
            </div>
          </div>
          {isMinimal ? (
            <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Why it works</div>
              <div className="mt-2 text-[9px] leading-4 text-slate-500">Clear, ATS-safe structure with a direct professional tone.</div>
            </div>
          ) : null}
          {template.layout.showSignatureLine ? (
            <div className="pt-3">
              <div className="text-[9px] text-slate-500">{mockCoverLetterIdentity.closing}</div>
              <div className="mt-2 h-px w-28 bg-slate-300" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewThumbnail({ template }: TemplatePreviewThumbnailProps) {
  return isResumeTemplate(template) ? (
    <ResumeTemplatePreview template={template} />
  ) : (
    <CoverLetterTemplatePreview template={template} />
  );
}
