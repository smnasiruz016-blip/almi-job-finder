"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string>("");

  const prefilledEmail = searchParams.get("email") ?? "";
  const duplicateAccount = error?.toLowerCase().includes("already have an almiworld account");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    setLastEmail(email);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      mode === "login"
        ? {
            email,
            password: formData.get("password")
          }
        : {
            name: formData.get("name"),
            email,
            password: formData.get("password")
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel mx-auto w-full max-w-lg rounded-[2rem] p-6 md:p-8"
    >
      <Image src="/brand/almi-latest.png" alt="Almiworld" width={160} height={60} className="h-auto w-[130px]" />
      <div className="space-y-2">
        <span className="eyebrow mt-5">{mode === "login" ? "Welcome back" : "Create account"}</span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-slate-950">
          {mode === "login" ? "Log in to your workspace" : "Start building your CV"}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          {mode === "login"
            ? "Access your CV drafts, cover letters, premium templates, and future export history."
            : "Create an account to start a polished CV, build a matching cover letter, and save drafts as you go."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {mode === "signup" && <Input name="name" placeholder="Full name" required />}
        <Input name="email" type="email" placeholder="Email address" defaultValue={mode === "login" ? prefilledEmail : ""} required />
        <Input name="password" type="password" placeholder="Password" required />
      </div>

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          {mode === "signup" && duplicateAccount ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/login?email=${encodeURIComponent(lastEmail || prefilledEmail)}`)}
              >
                Go to login
              </Button>
              <Link href={`/login?email=${encodeURIComponent(lastEmail || prefilledEmail)}`} className="font-semibold text-teal-700">
                Use this email to sign in
              </Link>
            </div>
          ) : null}
        </div>
      )}

      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
