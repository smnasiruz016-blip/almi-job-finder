import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, PenSquare, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const benefits = [
  "Build a professional CV in minutes",
  "Create a matching cover letter",
  "Improve your wording with AI",
  "Download a polished PDF"
];

const templateFamilies = [
  "Minimal ATS",
  "Modern Professional",
  "Bold Startup",
  "Creative Portfolio",
  "Compact One-Page",
  "Academic Clean"
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/dashboard" : "/signup";

  return (
    <main className="pb-20">
      <section className="page-shell pt-8 md:pt-12">
        <nav className="glass-panel flex flex-col gap-4 rounded-[2rem] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/brand/almi-latest.png" alt="Almiworld" width={170} height={60} className="h-auto w-[140px] md:w-[170px]" />
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-950">Almi CV Builder</p>
              <p className="text-sm text-slate-500">Professional CVs and cover letters for real job seekers.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {!user && (
              <Link href="/login" className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100">
                Log in
              </Link>
            )}
            <Link
              href={primaryHref}
              className="rounded-full border border-teal-200 bg-[#dff6ef] px-5 py-2.5 font-semibold text-teal-950 transition hover:bg-[#d2efe6]"
            >
              {user ? "Open dashboard" : "Start free"}
            </Link>
          </div>
        </nav>

        <div className="grid gap-8 pb-16 pt-10 md:grid-cols-[1.08fr_0.92fr] md:items-center md:pt-16">
          <div className="space-y-6">
            <span className="eyebrow">Professional career tools</span>
            <div className="space-y-4">
              <h1 className="section-title max-w-4xl font-[family-name:var(--font-display)]">
                Create a polished CV and matching cover letter with confidence.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Almi CV Builder helps students, early-career professionals, and career switchers turn their experience into a clear,
                premium-ready application pack with live preview, structured editing, and tasteful AI help.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 font-medium text-white transition hover:bg-teal-800"
                style={{ color: "#ffffff" }}
              >
                <span style={{ color: "#ffffff" }}>Build your CV</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates?kind=resume"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Browse templates
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
                  <CheckCircle2 className="mb-2 h-5 w-5 text-teal-700" />
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] bg-white/8 p-4">
                  <FileText className="h-5 w-5 text-emerald-300" />
                  <p className="mt-4 text-lg font-semibold">Live CV preview</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">
                    Fill structured sections once and see your document sharpen instantly as you edit.
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-white/8 p-4">
                  <PenSquare className="h-5 w-5 text-emerald-300" />
                  <p className="mt-4 text-lg font-semibold">Matching cover letters</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">
                    Build a matching letter in the same workspace so your applications stay consistent.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.25rem] bg-white/8 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">Template families</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {templateFamilies.map((family) => (
                    <span key={family} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                      {family}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
