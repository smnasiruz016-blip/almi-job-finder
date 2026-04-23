import Image from "next/image";
import Link from "next/link";
import { Crown, FileText, LayoutTemplate, PenSquare, Shield, Sparkles } from "lucide-react";
import { canUseAiWriting, canUsePremiumTemplates } from "@/lib/plans";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";

type SidebarNavProps = {
  user: SessionUser;
  className?: string;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: FileText },
  { href: "/templates?kind=resume", label: "CV Templates", icon: LayoutTemplate },
  { href: "/templates?kind=coverLetter", label: "Cover Letter Templates", icon: PenSquare }
] as const;

export function SidebarNav({ user, className }: SidebarNavProps) {
  const premiumTemplates = canUsePremiumTemplates(user.subscriptionTier);
  const aiWriting = canUseAiWriting(user.subscriptionTier);

  return (
    <aside className={cn("glass-panel rounded-[2rem] p-5", className)}>
      <div className="border-b border-slate-200 pb-5">
        <Image src="/brand/almi-latest.png" alt="Almiworld" width={180} height={70} className="h-auto w-[150px]" />
        <p className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-slate-950">Almi CV Builder</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Professional CVs and matching cover letters, built with calm structure and premium-ready templates.
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        )}
      </nav>

      <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-4 text-white">
        <p className="text-sm text-slate-300">Current plan</p>
        <p className="mt-2 text-xl font-semibold">{user.subscriptionTier === "PRO" ? "Premium" : "Free"}</p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-teal-300" />
            {premiumTemplates ? "Premium templates unlocked" : "Premium templates ready to unlock"}
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-300" />
            {aiWriting ? "AI writing help unlocked" : "AI writing help available on Premium"}
          </div>
        </div>
      </div>
    </aside>
  );
}
