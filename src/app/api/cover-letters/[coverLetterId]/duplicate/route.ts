import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { duplicateCoverLetterForUser } from "@/server/services/document-service";

type RouteContext = {
  params: Promise<{
    coverLetterId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { coverLetterId } = await context.params;
    const duplicate = await duplicateCoverLetterForUser(user.id, coverLetterId);

    if (!duplicate) {
      return NextResponse.json(
        {
          code: "COVER_LETTER_NOT_FOUND",
          message: "We couldn't find that cover letter."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      coverLetterId: duplicate.id
    });
  } catch {
    return NextResponse.json(
      {
        code: "DUPLICATE_COVER_LETTER_FAILED",
        message: "We couldn't duplicate that cover letter right now."
      },
      { status: 400 }
    );
  }
}
