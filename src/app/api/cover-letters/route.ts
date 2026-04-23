import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { createCoverLetterSchema } from "@/lib/validation/documents";
import { createCoverLetterForUser } from "@/server/services/document-service";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const payload = createCoverLetterSchema.parse(await request.json());
    const coverLetter = await createCoverLetterForUser(user.id, payload.templateKey);

    return NextResponse.json({
      coverLetterId: coverLetter.id
    });
  } catch {
    return NextResponse.json(
      {
        code: "CREATE_COVER_LETTER_FAILED",
        message: "We couldn't start that cover letter yet. Please try again."
      },
      { status: 400 }
    );
  }
}
