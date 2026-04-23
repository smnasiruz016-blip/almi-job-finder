import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createResumeForUser } from "@/server/services/document-service";

type NewResumePageProps = {
  searchParams?: Promise<{
    template?: string;
  }>;
};

export default async function NewResumePage({ searchParams }: NewResumePageProps) {
  const user = await requireUser();
  const params = (await searchParams) ?? {};
  const resume = await createResumeForUser(user.id, params.template);

  redirect(`/resumes/${resume.id}`);
}
