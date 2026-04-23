import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth";
import { updateResumeSchema } from "@/lib/validation/documents";
import { deleteResumeForUser, updateResumeForUser } from "@/server/services/document-service";

type RouteContext = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { resumeId } = await context.params;
    const payload = updateResumeSchema.parse(await request.json());

    await updateResumeForUser(user.id, resumeId, payload);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        code: "SAVE_RESUME_FAILED",
        message: "We couldn't save your CV changes. Please try again."
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getRequiredUser();
    const { resumeId } = await context.params;
    await deleteResumeForUser(user.id, resumeId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        code: "DELETE_RESUME_FAILED",
        message: "We couldn't delete that CV. Please try again."
      },
      { status: 400 }
    );
  }
}
