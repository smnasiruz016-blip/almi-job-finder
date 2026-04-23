"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import { DocumentEmptyState } from "@/components/documents/document-empty-state";
import { Button } from "@/components/ui/button";
import { getTemplateTierLabel } from "@/server/services/document-service";
import type { BuilderPlanSnapshot } from "@/types/documents";

type DocumentListItem = {
  id: string;
  title: string;
  templateKey: string;
  templateTier: "FREE" | "PREMIUM";
  status: "DRAFT" | "READY" | "ARCHIVED";
  updatedAt: string;
};

type DashboardShellProps = {
  userName: string;
  resumes: DocumentListItem[];
  coverLetters: DocumentListItem[];
  plan: BuilderPlanSnapshot;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function DocumentRow({
  kind,
  item,
  onDuplicate,
  onDelete
}: {
  kind: "resume" | "coverLetter";
  item: DocumentListItem;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const href = (kind === "resume" ? `/resumes/${item.id}` : `/cover-letters/${item.id}`) as Route;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{item.title}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {item.status.toLowerCase()}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              {getTemplateTierLabel(item.templateTier)}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Template: {item.templateKey} · Updated {formatDate(item.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void onDuplicate(item.id)}>
            Duplicate
          </Button>
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open
          </Link>
          <Button
            variant="ghost"
            onClick={() => void onDelete(item.id)}
            className="text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ userName, resumes, coverLetters, plan }: DashboardShellProps) {
  const router = useRouter();

  async function duplicateResume(id: string) {
    const response = await fetch(`/api/resumes/${id}/duplicate`, { method: "POST" });
    if (response.ok) {
      router.refresh();
    }
  }

  async function deleteResume(id: string) {
    const response = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  }

  async function duplicateCoverLetter(id: string) {
    const response = await fetch(`/api/cover-letters/${id}/duplicate`, { method: "POST" });
    if (response.ok) {
      router.refresh();
    }
  }

  async function deleteCoverLetter(id: string) {
    const response = await fetch(`/api/cover-letters/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow">Almi CV Builder</span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.04em] text-slate-950 md:text-5xl">
              Build a professional CV in minutes.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Welcome back, {userName}. Choose a polished template, fill your information once, and shape a matching
              cover letter with a live preview all the way through export.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-100">
              <p className="text-sm text-slate-500">My CVs</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{resumes.length}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-100">
              <p className="text-sm text-slate-500">Cover letters</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{coverLetters.length}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
              <p className="text-sm text-slate-300">Current plan</p>
              <p className="mt-2 text-3xl font-semibold">{plan.label}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-teal-50 p-3 text-teal-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">
                My documents
              </h2>
              <p className="text-sm text-slate-500">
                Create, duplicate, and organize your CVs and cover letters from one place.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/templates?kind=resume"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create CV
            </Link>
            <Link
              href="/templates?kind=coverLetter"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Create cover letter
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">
            Premium-ready
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Keep the free experience calm and useful today, with premium templates, AI writing help, and clean export
            hooks ready for a tasteful upgrade path later.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-[1.25rem] bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Sparkles className="h-4 w-4 text-teal-700" />
                <span className="font-medium">Premium templates</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {plan.features.canUsePremiumTemplates ? "Unlocked" : "Ready to gate on Pro"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Wand2 className="h-4 w-4 text-teal-700" />
                <span className="font-medium">AI wording help</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {plan.features.canUseAiWriting ? "Unlocked" : "Prepared for premium access"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">CVs</h2>
              <p className="mt-2 text-sm text-slate-500">
                Build one strong CV, then adapt it as your applications evolve.
              </p>
            </div>
            <Link href="/templates?kind=resume" className="text-sm font-semibold text-teal-700">
              Browse templates
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {resumes.length ? (
              resumes.map((resume) => (
                <DocumentRow
                  key={resume.id}
                  kind="resume"
                  item={resume}
                  onDuplicate={duplicateResume}
                  onDelete={deleteResume}
                />
              ))
            ) : (
              <DocumentEmptyState
                title="No CVs yet"
                description="Start with a polished template and we'll guide the structure, sections, and draft flow from the first minute."
                href="/templates?kind=resume"
                ctaLabel="Create your first CV"
              />
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950">
                Cover letters
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Create matching letters that feel consistent with the CV you already built.
              </p>
            </div>
            <Link href="/templates?kind=coverLetter" className="text-sm font-semibold text-teal-700">
              Browse templates
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {coverLetters.length ? (
              coverLetters.map((coverLetter) => (
                <DocumentRow
                  key={coverLetter.id}
                  kind="coverLetter"
                  item={coverLetter}
                  onDuplicate={duplicateCoverLetter}
                  onDelete={deleteCoverLetter}
                />
              ))
            ) : (
              <DocumentEmptyState
                title="No cover letters yet"
                description="Create a matching cover letter once your CV is ready, then keep polished drafts for different roles and companies."
                href="/templates?kind=coverLetter"
                ctaLabel="Create your first cover letter"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
