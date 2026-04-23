import type { Route } from "next";
import Link from "next/link";
import { Layers3, LockKeyhole, Palette, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { canUsePremiumTemplates } from "@/lib/plans";
import { TemplateCard } from "@/components/documents/template-card";
import { getCoverLetterTemplates, getResumeTemplates } from "@/server/templates/template-registry";

type TemplatesPageProps = {
  searchParams?: Promise<{
    kind?: "resume" | "coverLetter";
  }>;
};

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const user = await requireUser();
  const params = (await searchParams) ?? {};
  const kind = params.kind === "coverLetter" ? "coverLetter" : "resume";
  const premiumEnabled = canUsePremiumTemplates(user.subscriptionTier);

  const templates = kind === "resume" ? getResumeTemplates() : getCoverLetterTemplates();
  const premiumCount = templates.filter((template) => template.metadata.tier === "PREMIUM").length;
  const freeCount = templates.length - premiumCount;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.08)] md:p-8">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.18),_transparent_38%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0))]" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow">{kind === "resume" ? "CV template showroom" : "Cover letter template showroom"}</span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.04em] text-slate-950 md:text-5xl">
              Choose a polished direction before you write a single line.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Start with a layout that already feels premium. Every family has its own rhythm, density, and tone so users can
              move faster without landing in a bland one-style-fits-all builder.
            </p>
            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <Link
                href={"/templates?kind=resume" as Route}
                className={
                  kind === "resume"
                    ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                }
              >
                CV Templates
              </Link>
              <Link
                href={"/templates?kind=coverLetter" as Route}
                className={
                  kind === "coverLetter"
                    ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                }
              >
                Cover Letter Templates
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Best experience</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Pick a visual direction first, then edit inside one shared builder.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Premium promise</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Stronger visual identity, calmer spacing, and more distinct document personality.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fastest path</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Choose, fill, preview, and move toward export without relearning the layout every time.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Templates</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950">{templates.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Premium</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950">{premiumCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Free to start</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950">{freeCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Best for</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                {kind === "resume" ? "ATS-safe, modern, creative, and academic CVs" : "Fast, professional job applications"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">How the showroom works</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">
                Compare style, layout, and tone before you commit.
              </h2>
            </div>
            <div className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white md:inline-flex">
              {kind === "resume" ? "CV-first flow" : "Letter-first flow"}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Layers3 className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Layout systems</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Sidebar, editorial, compact, and classic structures built from one reusable engine.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Palette className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Theme families</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Each family changes rhythm, density, hierarchy, and mood - not just accent color.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Speed to first draft</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Pick a direction, fill your content once, and keep previewing live as the document sharpens.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_70px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Premium access</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            Premium templates should feel worth upgrading for.
          </h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
              <p className="text-sm leading-6 text-white/80">
                Premium families carry stronger visual identity, calmer spacing, and more differentiated presentation.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
              <p className="text-sm leading-6 text-white/80">
                Free templates stay strong and usable. Premium should feel like a creative advantage, not a penalty box.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Browse collection</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Template families that feel different at a glance.
          </h2>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const href =
            kind === "resume"
              ? `/resumes/new?template=${template.metadata.key}`
              : `/cover-letters/new?template=${template.metadata.key}`;

          return (
            <TemplateCard
              key={template.metadata.key}
              template={template}
              href={href as Route}
              premiumLocked={template.metadata.tier === "PREMIUM" && !premiumEnabled}
            />
          );
        })}
      </div>
    </div>
  );
}
