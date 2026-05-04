import { getRequiredUser } from "@/lib/auth";
import { trackProductEvent } from "@/lib/analytics";
import { jsonError } from "@/lib/http";
import { handleResumeUpload } from "@/server/services/resume-service";

export async function POST(request: Request) {
  let user;

  try {
    user = await getRequiredUser();
  } catch {
    return jsonError("Unauthorized.", 401);
  }

  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "Choose a resume file before uploading.", code: "MISSING_FILE" },
      { status: 400 }
    );
  }

  try {
    const { resume, parsed } = await handleResumeUpload(user.id, file);
    await trackProductEvent({
      name: "resume_uploaded",
      userId: user.id,
      properties: {
        mimeType: file.type,
        skillCount: parsed.skills.length,
        experienceKeywordCount: parsed.experienceKeywords.length,
        preferredRoleCount: parsed.preferredRoles.length
      }
    });
    return Response.json({
      resumeId: resume.id,
      parsed
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload resume.";

    // ---- Specific error codes from the parser layer ----

    if (message.startsWith("EMPTY_FILE")) {
      return Response.json(
        {
          error: "The file you uploaded is empty. Please choose a valid resume file and try again.",
          code: "EMPTY_FILE"
        },
        { status: 400 }
      );
    }

    if (message.startsWith("PDF_NO_TEXT_LAYER")) {
      return Response.json(
        {
          error:
            "This PDF looks like a scanned image — we could not find any selectable text in it. Please re-export your resume as a text-based PDF (from Word, Google Docs, or your CV builder) or upload a DOCX file instead.",
          code: "PDF_NO_TEXT_LAYER"
        },
        { status: 400 }
      );
    }

    if (message.startsWith("PDF_CORRUPT")) {
      return Response.json(
        {
          error:
            "We could not open this PDF — it may be corrupted or password-protected. Please re-save and upload again, or try a DOCX file.",
          code: "PDF_CORRUPT"
        },
        { status: 400 }
      );
    }

    if (message.startsWith("DOCX_CORRUPT")) {
      return Response.json(
        {
          error:
            "We could not open this DOCX file — it may be corrupted. Please re-save and upload again, or try a PDF.",
          code: "DOCX_CORRUPT"
        },
        { status: 400 }
      );
    }

    if (message.startsWith("DOCX_EMPTY")) {
      return Response.json(
        {
          error:
            "We could not find any text in this DOCX file. Please make sure your resume contains text (not just images) and try again.",
          code: "DOCX_EMPTY"
        },
        { status: 400 }
      );
    }

    if (message.startsWith("UNSUPPORTED_TYPE") || message.includes("Unsupported") || message.includes("supported")) {
      return Response.json(
        { error: "Please upload a PDF or DOCX resume.", code: "UNSUPPORTED_FILE" },
        { status: 400 }
      );
    }

    if (message.includes("5MB")) {
      return Response.json(
        {
          error: "Your resume is too large. Please upload a file smaller than 5MB.",
          code: "FILE_TOO_LARGE"
        },
        { status: 400 }
      );
    }

    // Generic fallback
    return Response.json(
      {
        error:
          "Something went wrong while processing your resume. Please try a different export (PDF or DOCX) and try again.",
        code: "PARSING_FAILED"
      },
      { status: 400 }
    );
  }
}
