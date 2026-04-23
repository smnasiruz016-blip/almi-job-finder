import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { updateCoverLetterSchema } from "@/lib/validation/documents";
import { deleteCoverLetterForUser, updateCoverLetterForUser } from "@/server/services/document-service";

type RouteContext = {
  params: Promise<{
    coverLetterId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { coverLetterId } = await context.params;
    const payload = updateCoverLetterSchema.parse(await request.json());

    await updateCoverLetterForUser(user.id, coverLetterId, payload);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        code: "SAVE_COVER_LETTER_FAILED",
        message: "We couldn't save your cover letter changes. Please try again."
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { coverLetterId } = await context.params;
    await deleteCoverLetterForUser(user.id, coverLetterId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        code: "DELETE_COVER_LETTER_FAILED",
        message: "We couldn't delete that cover letter. Please try again."
      },
      { status: 400 }
    );
  }
}
