import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { duplicateResumeForUser } from "@/server/services/document-service";

type RouteContext = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { resumeId } = await context.params;
    const duplicate = await duplicateResumeForUser(user.id, resumeId);

    if (!duplicate) {
      return NextResponse.json(
        {
          code: "RESUME_NOT_FOUND",
          message: "We couldn't find that CV."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      resumeId: duplicate.id
    });
  } catch {
    return NextResponse.json(
      {
        code: "DUPLICATE_RESUME_FAILED",
        message: "We couldn't duplicate that CV right now."
      },
      { status: 400 }
    );
  }
}
