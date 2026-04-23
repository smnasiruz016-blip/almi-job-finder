import { requireUser } from "@/lib/auth";
import { getPlanDefinition } from "@/lib/plans";
import { DashboardShell } from "@/components/documents/dashboard-shell";
import { listDocumentsForDashboard } from "@/server/services/document-service";

export default async function DashboardPage() {
  const user = await requireUser();
  let resumes: Awaited<ReturnType<typeof listDocumentsForDashboard>>["resumes"] = [];
  let coverLetters: Awaited<ReturnType<typeof listDocumentsForDashboard>>["coverLetters"] = [];

  try {
    const documents = await listDocumentsForDashboard(user.id);
    resumes = documents.resumes;
    coverLetters = documents.coverLetters;
  } catch {
    resumes = [];
    coverLetters = [];
  }
  const plan = getPlanDefinition(user.subscriptionTier);

  return (
    <DashboardShell
      userName={user.name}
      resumes={resumes.map((item) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString()
      }))}
      coverLetters={coverLetters.map((item) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString()
      }))}
      plan={plan}
    />
  );
}
