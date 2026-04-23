import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canUseAiWriting, canUsePremiumTemplates } from "@/lib/plans";
import { CoverLetterBuilder } from "@/components/documents/cover-letter-builder";
import { getCoverLetterById } from "@/server/services/document-service";
import { getCoverLetterTemplates } from "@/server/templates/template-registry";

type CoverLetterEditorPageProps = {
  params: Promise<{
    coverLetterId: string;
  }>;
};

export default async function CoverLetterEditorPage({ params }: CoverLetterEditorPageProps) {
  const user = await requireUser();
  const { coverLetterId } = await params;
  const coverLetter = await getCoverLetterById(user.id, coverLetterId);

  if (!coverLetter) {
    notFound();
  }

  return (
    <CoverLetterBuilder
      coverLetter={{
        ...coverLetter,
        updatedAt: coverLetter.updatedAt.toISOString()
      }}
      templates={getCoverLetterTemplates()}
      canUsePremiumTemplates={canUsePremiumTemplates(user.subscriptionTier)}
      canUseAiWriting={canUseAiWriting(user.subscriptionTier)}
    />
  );
}
