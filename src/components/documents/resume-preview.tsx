import { Globe, Link2, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeData, ResumeTemplateConfig } from "@/types/documents";

type ResumePreviewProps = {
  template: ResumeTemplateConfig;
  data: ResumeData;
  sectionOrder: string[];
  hiddenSections: string[];
  photoEnabled: boolean;
};

function joinMeta(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" | ");
}

function PreviewSectionTitle({
  children,
  accent,
  compact,
  isSidebar
}: {
  children: React.ReactNode;
  accent: string;
  compact?: boolean;
  isSidebar?: boolean;
}) {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.22em]",
          isSidebar ? "text-slate-500" : "text-slate-600"
        )}
        style={{ color: accent }}
      >
        {children}
      </p>
      <div className="h-px w-full bg-slate-200" />
    </div>
  );
}

function ContactRow({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function ResumePreview({ template, data, sectionOrder, hiddenSections, photoEnabled }: ResumePreviewProps) {
  const orderedSections = sectionOrder.filter((section) => !hiddenSections.includes(section));
  const hasSidebar = template.layout.mode === "two-column" || template.layout.mode === "header-accent";
  const compact = template.layout.density === "compact";
  const sidebarSections = new Set(template.layout.sidebarSections);
  const leftSections = hasSidebar ? orderedSections.filter((section) => sidebarSections.has(section)) : [];
  const rightSections = hasSidebar ? orderedSections.filter((section) => !sidebarSections.has(section)) : orderedSections;
  const showPhoto = template.layout.showPhoto && photoEnabled;
  const isCreative = template.family === "CREATIVE_PORTFOLIO";
  const isBold = template.family === "BOLD_STARTUP";
  const isAcademic = template.family === "ACADEMIC_CLEAN";
  const isMinimal = template.family === "MINIMAL_ATS";

  const sectionContent: Record<string, React.ReactNode> = {
    basics: (
      <div className={cn("space-y-4", compact && "space-y-3")}>
        <div className={cn("flex items-start gap-4", !showPhoto && "block")}>
          {showPhoto ? (
            <div
              className={cn(
                "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 text-[10px] font-medium uppercase tracking-[0.16em]",
                isCreative ? "rounded-[2rem]" : "rounded-full"
              )}
              style={{
                borderColor: isCreative ? template.theme.accentSoft : "rgba(255,255,255,0.9)",
                background: template.theme.accentSoft,
                color: template.theme.accent
              }}
            >
              {data.basics.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.basics.photoUrl} alt={data.basics.fullName || "Profile"} className="h-full w-full object-cover" />
              ) : (
                "Photo"
              )}
            </div>
          ) : null}

          <div className="min-w-0 space-y-2">
            <p
              className={cn(
                "font-[family-name:var(--font-display)] text-3xl font-semibold leading-none text-slate-950",
                compact && "text-[2rem]",
                isMinimal && "tracking-[-0.03em]"
              )}
            >
              {data.basics.fullName || "Your Name"}
            </p>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              {data.basics.professionalTitle || "Target role"}
            </p>
            <div className="grid gap-2 pt-1 md:grid-cols-2">
              {data.basics.email ? <ContactRow icon={Mail}>{data.basics.email}</ContactRow> : null}
              {data.basics.phone ? <ContactRow icon={Phone}>{data.basics.phone}</ContactRow> : null}
              {data.basics.location ? <ContactRow icon={MapPin}>{data.basics.location}</ContactRow> : null}
              {data.basics.website ? <ContactRow icon={Globe}>{data.basics.website}</ContactRow> : null}
              {data.basics.linkedIn ? <ContactRow icon={Link2}>{data.basics.linkedIn}</ContactRow> : null}
            </div>
          </div>
        </div>
      </div>
    ),
    summary: data.summary ? (
      <div className="space-y-3">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact}>
          Profile
        </PreviewSectionTitle>
        <p className="text-sm leading-7 text-slate-700">{data.summary}</p>
      </div>
    ) : null,
    experience: data.experience.length ? (
      <div className="space-y-4">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact}>
          Experience
        </PreviewSectionTitle>
        {data.experience.map((item) => (
          <div key={item.id} className={cn("space-y-2", compact && "space-y-1.5")}>
            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.role || "Role title"}</p>
                <p className="text-sm text-slate-500">{item.company || "Company"}</p>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                {joinMeta([item.startDate || "Start", item.endDate || "Present"])}
              </p>
            </div>
            {item.location ? <p className="text-sm text-slate-500">{item.location}</p> : null}
            {item.bullets.length ? (
              <ul className="space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                {item.bullets.map((highlight, index) => (
                  <li key={`${item.id}-${index}`} className="list-disc">
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    ) : null,
    education: data.education.length ? (
      <div className="space-y-4">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact}>
          Education
        </PreviewSectionTitle>
        {data.education.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <p className="font-semibold text-slate-900">{item.degree || "Degree"}</p>
            <p className="text-sm text-slate-500">
              {joinMeta([item.school || "School", item.location, item.startDate || "Start", item.endDate || "End"])}
            </p>
            {item.details ? <p className="text-sm leading-7 text-slate-700">{item.details}</p> : null}
          </div>
        ))}
      </div>
    ) : null,
    skills: data.skills.length ? (
      <div className="space-y-3">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact} isSidebar>
          Skills
        </PreviewSectionTitle>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                isCreative ? "shadow-sm" : "",
                isMinimal ? "border border-slate-200 bg-white" : ""
              )}
              style={{
                background: isMinimal ? "#ffffff" : template.theme.accentSoft,
                color: template.theme.text
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : null,
    projects: data.projects.length ? (
      <div className="space-y-4">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact}>
          Projects
        </PreviewSectionTitle>
        {data.projects.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">{item.name || "Project name"}</p>
              {item.link ? <span className="text-xs font-medium" style={{ color: template.theme.accent }}>{item.link}</span> : null}
            </div>
            {item.role ? <p className="text-sm text-slate-500">{item.role}</p> : null}
            {item.bullets.length ? (
              <ul className="space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                {item.bullets.map((bullet, index) => (
                  <li key={`${item.id}-${index}`} className="list-disc">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    ) : null,
    certifications: data.certifications.length ? (
      <div className="space-y-4">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact} isSidebar>
          Certifications
        </PreviewSectionTitle>
        {data.certifications.map((item) => (
          <div key={item.id}>
            <p className="font-semibold text-slate-900">{item.name || "Certification"}</p>
            <p className="text-sm text-slate-500">{joinMeta([item.issuer || "Issuer", item.year])}</p>
          </div>
        ))}
      </div>
    ) : null,
    links: data.links.length ? (
      <div className="space-y-3">
        <PreviewSectionTitle accent={template.theme.accent} compact={compact} isSidebar>
          Links
        </PreviewSectionTitle>
        <div className="space-y-2 text-sm text-slate-700">
          {data.links.map((item) => (
            <div key={item.id}>
              <span className="font-medium text-slate-900">{item.label || "Link"}:</span> {item.url || "https://"}
            </div>
          ))}
        </div>
      </div>
    ) : null
  };

  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <div
        className={cn(
          "overflow-hidden rounded-[1.75rem] shadow-[0_20px_80px_rgba(15,23,42,0.08)]",
          isAcademic && "border border-slate-200",
          isMinimal && "border border-slate-200"
        )}
        style={{ background: template.theme.surface }}
      >
        <div
          className={cn(
            "px-6 py-6",
            template.layout.mode === "header-accent" && "pb-4",
            isBold && "text-white"
          )}
          style={{
            background:
              template.layout.mode === "header-accent" || isBold
                ? `linear-gradient(135deg, ${template.theme.accent}, ${template.theme.muted})`
                : template.theme.surface
          }}
        >
          {sectionContent.basics}
        </div>

        <div
          className={cn(
            "grid gap-8 px-6 py-6",
            hasSidebar ? "md:grid-cols-[0.78fr_1.22fr]" : "grid-cols-1"
          )}
        >
          {hasSidebar ? (
            <aside
              className={cn(
                "space-y-6 rounded-[1.5rem] p-5",
                isCreative ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" : "",
                isAcademic ? "border border-slate-200" : ""
              )}
              style={{
                background: isBold ? "rgba(15, 23, 42, 0.04)" : template.theme.accentSoft
              }}
            >
              {leftSections.map((section) => (
                <div key={section}>{sectionContent[section]}</div>
              ))}
            </aside>
          ) : null}

          <main className="space-y-6">
            {rightSections.map((section) => (
              <div
                key={section}
                className={cn(
                  section === "projects" && isCreative && "rounded-[1.35rem] border border-slate-100 bg-white p-5 shadow-sm",
                  section === "education" && isAcademic && "rounded-[1.35rem] border border-slate-100 bg-slate-50/70 p-5"
                )}
              >
                {sectionContent[section]}
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
