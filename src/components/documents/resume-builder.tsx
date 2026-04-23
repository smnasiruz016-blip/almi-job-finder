"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, Save, Sparkles } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ResumePreview } from "@/components/documents/resume-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { normalizeStringList } from "@/lib/document-defaults";
import type { ResumeBuilderDocument, ResumeData, ResumeTemplateConfig } from "@/types/documents";

type ResumeBuilderProps = {
  resume: ResumeBuilderDocument;
  templates: ResumeTemplateConfig[];
  canUsePremiumTemplates: boolean;
  canUseAiWriting: boolean;
};

type ResumeFormValues = {
  title: string;
  templateKey: string;
  photoEnabled: boolean;
  basics: ResumeData["basics"];
  summary: string;
  experience: ResumeData["experience"];
  education: ResumeData["education"];
  skillsText: string;
  projects: ResumeData["projects"];
  certifications: ResumeData["certifications"];
  links: ResumeData["links"];
};

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function createBullet() {
  return "";
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ResumeBuilder({
  resume,
  templates,
  canUsePremiumTemplates,
  canUseAiWriting
}: ResumeBuilderProps) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [sectionOrder, setSectionOrder] = useState<string[]>(resume.sectionOrder);
  const [hiddenSections, setHiddenSections] = useState<string[]>(resume.hiddenSections);

  const form = useForm<ResumeFormValues>({
    defaultValues: {
      title: resume.title,
      templateKey: resume.templateKey,
      photoEnabled: resume.photoEnabled,
      basics: resume.draftData.basics,
      summary: resume.draftData.summary,
      experience: resume.draftData.experience,
      education: resume.draftData.education,
      skillsText: resume.draftData.skills.join(", "),
      projects: resume.draftData.projects,
      certifications: resume.draftData.certifications,
      links: resume.draftData.links
    }
  });

  const experienceFields = useFieldArray({ control: form.control, name: "experience" });
  const educationFields = useFieldArray({ control: form.control, name: "education" });
  const projectFields = useFieldArray({ control: form.control, name: "projects" });
  const certificationFields = useFieldArray({ control: form.control, name: "certifications" });
  const linkFields = useFieldArray({ control: form.control, name: "links" });

  const watched = useWatch({ control: form.control }) as ResumeFormValues;
  const experienceValues = useWatch({ control: form.control, name: "experience" }) ?? [];
  const projectValues = useWatch({ control: form.control, name: "projects" }) ?? [];

  const activeTemplate = useMemo(
    () => templates.find((template) => template.metadata.key === watched.templateKey) ?? templates[0],
    [templates, watched.templateKey]
  );

  const previewData = useMemo<ResumeData>(
    () => ({
      basics: watched.basics,
      summary: watched.summary.trim(),
      experience: (watched.experience ?? []).map((item) => ({
        ...item,
        bullets: (item.bullets ?? []).map((bullet) => bullet.trim()).filter(Boolean)
      })),
      education: watched.education ?? [],
      skills: normalizeStringList(watched.skillsText ?? ""),
      projects: (watched.projects ?? []).map((item) => ({
        ...item,
        bullets: (item.bullets ?? []).map((bullet) => bullet.trim()).filter(Boolean)
      })),
      certifications: watched.certifications ?? [],
      links: (watched.links ?? []).filter((item) => item.label.trim() || item.url.trim())
    }),
    [watched]
  );

  function moveSection(section: string, direction: -1 | 1) {
    setSectionOrder((current) => {
      const index = current.indexOf(section);
      if (index < 0) {
        return current;
      }

      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const clone = [...current];
      [clone[index], clone[targetIndex]] = [clone[targetIndex], clone[index]];
      return clone;
    });
  }

  function toggleSection(section: string) {
    setHiddenSections((current) =>
      current.includes(section) ? current.filter((entry) => entry !== section) : [...current, section]
    );
  }

  async function onSubmit(values: ResumeFormValues) {
    setSaveState("saving");

    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        templateKey: values.templateKey,
        photoEnabled: values.photoEnabled,
        accentColor: activeTemplate.theme.accent,
        sectionOrder,
        hiddenSections,
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950">
                CV Builder
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Build a professional CV in minutes with a structured editor and live preview.
              </p>
            </div>
            <Button type="submit" className="gap-2" disabled={saveState === "saving"}>
              <Save className="h-4 w-4" />
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save draft"}
            </Button>
          </div>
        </div>

        <SectionCard
          title="Template and title"
          description="Start with a format that matches your style, then keep the draft easy to recognize later."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Document title</span>
              <Input {...form.register("title")} placeholder="My professional CV" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Template</span>
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
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              {...form.register("photoEnabled")}
              className="h-4 w-4 rounded border-slate-300 text-teal-700"
            />
            Use photo mode when the selected template supports it
          </label>
        </SectionCard>

        <SectionCard title="Basics" description="Keep your top-line details clean and easy to scan.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input {...form.register("basics.fullName")} placeholder="Full name" />
            <Input {...form.register("basics.professionalTitle")} placeholder="Professional title" />
            <Input {...form.register("basics.email")} placeholder="Email address" />
            <Input {...form.register("basics.phone")} placeholder="Phone number" />
            <Input {...form.register("basics.location")} placeholder="Location" />
            <Input {...form.register("basics.website")} placeholder="Website or portfolio" />
            <Input {...form.register("basics.linkedIn")} placeholder="LinkedIn URL" className="md:col-span-2" />
          </div>
        </SectionCard>

        <SectionCard
          title="Summary"
          description="A short, focused profile helps employers understand your direction quickly."
        >
          <Textarea
            {...form.register("summary")}
            rows={5}
            placeholder="Summarize your strengths, focus, and the value you bring."
          />
          <div className="mt-3 rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Sparkles className="h-4 w-4 text-teal-700" />
              Improve summary with AI
            </div>
            <p className="mt-2">
              {canUseAiWriting
                ? "AI writing actions are prepared for the next build phase."
                : "AI writing will be available behind premium-ready access later."}
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Experience"
          description="Use clear outcome-focused bullets so employers can quickly understand your impact."
        >
          <div className="space-y-6">
            {experienceFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input {...form.register(`experience.${index}.role`)} placeholder="Role title" />
                  <Input {...form.register(`experience.${index}.company`)} placeholder="Company" />
                  <Input {...form.register(`experience.${index}.location`)} placeholder="Location" />
                  <Input {...form.register(`experience.${index}.startDate`)} placeholder="Start date" />
                  <Input {...form.register(`experience.${index}.endDate`)} placeholder="End date" />
                </div>
                <div className="mt-4 space-y-2">
                  {[0, 1, 2].map((bulletIndex) => (
                    <Textarea
                      key={bulletIndex}
                      value={experienceValues[index]?.bullets?.[bulletIndex] ?? ""}
                      onChange={(event) =>
                        form.setValue(`experience.${index}.bullets.${bulletIndex}`, event.target.value, {
                          shouldDirty: true
                        })
                      }
                      rows={2}
                      placeholder={`Bullet point ${bulletIndex + 1}`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" onClick={() => experienceFields.remove(index)}>
                    Remove role
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                experienceFields.append({
                  id: createId("exp"),
                  role: "",
                  company: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  bullets: [createBullet(), createBullet(), createBullet()]
                })
              }
            >
              Add experience
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Education" description="Keep only the education details that help your target role.">
          <div className="space-y-6">
            {educationFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input {...form.register(`education.${index}.degree`)} placeholder="Degree" />
                  <Input {...form.register(`education.${index}.school`)} placeholder="School" />
                  <Input {...form.register(`education.${index}.location`)} placeholder="Location" />
                  <Input {...form.register(`education.${index}.startDate`)} placeholder="Start date" />
                  <Input {...form.register(`education.${index}.endDate`)} placeholder="End date" />
                </div>
                <div className="mt-4">
                  <Textarea
                    {...form.register(`education.${index}.details`)}
                    rows={3}
                    placeholder="Coursework, honors, or supporting context"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" onClick={() => educationFields.remove(index)}>
                    Remove education
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                educationFields.append({
                  id: createId("edu"),
                  degree: "",
                  school: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  details: ""
                })
              }
            >
              Add education
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Skills" description="Add concise, searchable keywords that support the role you want.">
          <Textarea
            {...form.register("skillsText")}
            rows={3}
            placeholder="React, TypeScript, UX Research, Stakeholder Communication"
          />
        </SectionCard>

        <SectionCard
          title="Projects, certifications, and links"
          description="Use proof points that reinforce your story without overcrowding the page."
        >
          <div className="space-y-6">
            {projectFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input {...form.register(`projects.${index}.name`)} placeholder="Project name" />
                  <Input {...form.register(`projects.${index}.role`)} placeholder="Your role" />
                  <Input {...form.register(`projects.${index}.link`)} placeholder="Project link" className="md:col-span-2" />
                </div>
                <div className="mt-4 space-y-2">
                  {[0, 1].map((bulletIndex) => (
                    <Textarea
                      key={bulletIndex}
                      value={projectValues[index]?.bullets?.[bulletIndex] ?? ""}
                      onChange={(event) =>
                        form.setValue(`projects.${index}.bullets.${bulletIndex}`, event.target.value, {
                          shouldDirty: true
                        })
                      }
                      rows={2}
                      placeholder={`Project bullet ${bulletIndex + 1}`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" onClick={() => projectFields.remove(index)}>
                    Remove project
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                projectFields.append({
                  id: createId("project"),
                  name: "",
                  role: "",
                  link: "",
                  bullets: [createBullet(), createBullet()]
                })
              }
            >
              Add project
            </Button>

            {certificationFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input {...form.register(`certifications.${index}.name`)} placeholder="Certification name" />
                  <Input {...form.register(`certifications.${index}.issuer`)} placeholder="Issuer" />
                  <Input {...form.register(`certifications.${index}.year`)} placeholder="Year" />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" onClick={() => certificationFields.remove(index)}>
                    Remove certification
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                certificationFields.append({
                  id: createId("cert"),
                  name: "",
                  issuer: "",
                  year: ""
                })
              }
            >
              Add certification
            </Button>

            {linkFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input {...form.register(`links.${index}.label`)} placeholder="Link label" />
                  <Input {...form.register(`links.${index}.url`)} placeholder="https://..." />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" onClick={() => linkFields.remove(index)}>
                    Remove link
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                linkFields.append({
                  id: createId("link"),
                  label: "",
                  url: ""
                })
              }
            >
              Add link
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Section order and visibility"
          description="Control the reading flow without turning the builder into a complicated design tool."
        >
          <div className="space-y-3">
            {sectionOrder.map((section, index) => (
              <div
                key={section}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium capitalize text-slate-900">{section.replace(/-/g, " ")}</p>
                  <p className="text-sm text-slate-500">
                    {hiddenSections.includes(section) ? "Hidden in preview" : "Visible in preview"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" onClick={() => moveSection(section, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => moveSection(section, 1)}
                    disabled={index === sectionOrder.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => toggleSection(section)}>
                    {hiddenSections.includes(section) ? "Show" : "Hide"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </form>

      <div className="space-y-5">
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="flex items-center gap-2 text-slate-900">
            <Eye className="h-4 w-4 text-teal-700" />
            <p className="font-medium">Live preview</p>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            See every update as you edit so you can get to a polished CV faster.
          </p>
        </div>
        <ResumePreview
          template={activeTemplate}
          data={previewData}
          sectionOrder={sectionOrder}
          hiddenSections={hiddenSections}
          photoEnabled={watched.photoEnabled}
        />
      </div>
    </div>
  );
}
