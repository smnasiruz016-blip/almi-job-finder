import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createCoverLetterForUser } from "@/server/services/document-service";

type NewCoverLetterPageProps = {
  searchParams?: Promise<{
    template?: string;
  }>;
};

export default async function NewCoverLetterPage({ searchParams }: NewCoverLetterPageProps) {
  const user = await requireUser();
  const params = (await searchParams) ?? {};
  const coverLetter = await createCoverLetterForUser(user.id, params.template);

  redirect(`/cover-letters/${coverLetter.id}`);
}
