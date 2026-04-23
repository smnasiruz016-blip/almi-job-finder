import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { createResumeSchema } from "@/lib/validation/documents";
import { createResumeForUser } from "@/server/services/document-service";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const payload = createResumeSchema.parse(await request.json());
    const resume = await createResumeForUser(user.id, payload.templateKey);

    return NextResponse.json({
      resumeId: resume.id
    });
  } catch {
    return NextResponse.json(
      {
        code: "CREATE_RESUME_FAILED",
        message: "We couldn't start that CV yet. Please try again."
      },
      { status: 400 }
    );
  }
}
