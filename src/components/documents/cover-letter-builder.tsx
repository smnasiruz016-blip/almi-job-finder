"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { CoverLetterPreview } from "@/components/documents/cover-letter-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CoverLetterBuilderDocument, CoverLetterData, CoverLetterTemplateConfig } from "@/types/documents";

type CoverLetterBuilderProps = {
  coverLetter: CoverLetterBuilderDocument;
  templates: CoverLetterTemplateConfig[];
  canUsePremiumTemplates: boolean;
  canUseAiWriting: boolean;
};

type CoverLetterFormValues = {
  title: string;
  templateKey: string;
  jobTitle: string;
  company: string;
  hiringManager: string;
  intro: string;
  body: string;
  closing: string;
};

export function CoverLetterBuilder({
  coverLetter,
  templates,
  canUsePremiumTemplates,
  canUseAiWriting
}: CoverLetterBuilderProps) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const form = useForm<CoverLetterFormValues>({
    defaultValues: {
      title: coverLetter.title,
      templateKey: coverLetter.templateKey,
      jobTitle: coverLetter.draftData.jobTitle,
      company: coverLetter.draftData.company,
      hiringManager: coverLetter.draftData.hiringManager,
      intro: coverLetter.draftData.intro,
      body: coverLetter.draftData.body,
      closing: coverLetter.draftData.closing
    }
  });

  const watched = useWatch({ control: form.control }) as CoverLetterFormValues;
  const activeTemplate = useMemo(
    () => templates.find((template) => template.metadata.key === watched.templateKey) ?? templates[0],
    [templates, watched.templateKey]
  );

  const previewData: CoverLetterData = {
    jobTitle: watched.jobTitle,
    company: watched.company,
    hiringManager: watched.hiringManager,
    intro: watched.intro,
    body: watched.body,
    closing: watched.closing
  };

  async function onSubmit(values: CoverLetterFormValues) {
    setSaveState("saving");

    const response = await fetch(`/api/cover-letters/${coverLetter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        templateKey: values.templateKey,
        draftData: previewData
      })
    });

    if (!response.ok) {
      setSaveState("error");
      return;
    }

    setSaveState("saved");
    router.refresh();
    window.setTimeout(() => setSaveState("idle"), 1800);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950">
                Cover Letter Builder
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Create a matching letter that feels clear, intentional, and ready to send.
              </p>
            </div>
            <Button type="submit" disabled={saveState === "saving"}>
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save draft"}
            </Button>
          </div>
        </div>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950">Setup</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep the setup practical first, then shape the actual letter underneath.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input {...form.register("title")} placeholder="Document title" />
            <Select {...form.register("templateKey")}>
              {templates.map((template) => (
                <option
                  key={template.metadata.key}
                  value={template.metadata.key}
                  disabled={template.metadata.tier === "PREMIUM" && !canUsePremiumTemplates}
                >
                  {`${template.metadata.name}${template.metadata.tier === "PREMIUM" ? " · Premium" : ""}`}
                </option>
              ))}
            </Select>
            <Input {...form.register("jobTitle")} placeholder="Job title" />
            <Input {...form.register("company")} placeholder="Company" />
            <Input {...form.register("hiringManager")} placeholder="Hiring manager" className="md:col-span-2" />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950">
            Letter content
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Focus on fit, clarity, and confident tone rather than writing too much.
          </p>
          <div className="mt-4 space-y-4">
            <Textarea {...form.register("intro")} rows={4} placeholder="Why are you interested in this role?" />
            <Textarea
              {...form.register("body")}
              rows={7}
              placeholder="What experience, strengths, and results should they know about?"
            />
            <Textarea {...form.register("closing")} rows={4} placeholder="How do you want to close the letter?" />
          </div>
          <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
            AI drafting and tone refinement are{" "}
            {canUseAiWriting ? "prepared for the next phase." : "set aside for premium access next."}
          </div>
        </section>
      </form>

      <div className="space-y-5">
        <div className="glass-panel rounded-[2rem] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950">
            Live preview
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Keep the tone clean and the structure easy to scan before you export it.
          </p>
        </div>
        <CoverLetterPreview template={activeTemplate} data={previewData} />
      </div>
    </div>
  );
}
