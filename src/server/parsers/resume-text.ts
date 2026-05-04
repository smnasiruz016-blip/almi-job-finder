import mammoth from "mammoth";
import pdfParse from "pdf-parse";

/**
 * Extracts plain text from a resume file (PDF or DOCX) given as raw bytes.
 *
 * Pure in-memory: never touches disk. Works on serverless (Vercel/Lambda).
 * International-friendly: preserves Unicode characters.
 */
export async function extractResumeText(bytes: Buffer, mimeType: string): Promise<string> {
  if (bytes.length === 0) {
    throw new Error("EMPTY_FILE: The uploaded file is empty.");
  }

  if (mimeType === "application/pdf") {
    return extractPdfText(bytes);
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return extractDocxText(bytes);
  }

  throw new Error("UNSUPPORTED_TYPE: Unsupported file type.");
}

async function extractPdfText(bytes: Buffer): Promise<string> {
  let result: Awaited<ReturnType<typeof pdfParse>>;

  try {
    result = await pdfParse(bytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown PDF parse error";
    throw new Error(`PDF_CORRUPT: Could not read PDF file (${message}).`);
  }

  const cleaned = cleanExtractedText(result.text ?? "");

  if (cleaned.length < 20) {
    throw new Error(
      "PDF_NO_TEXT_LAYER: This PDF appears to be a scanned image with no selectable text. " +
        "Please re-export your resume as a text-based PDF or upload a DOCX file instead."
    );
  }

  return cleaned;
}

async function extractDocxText(bytes: Buffer): Promise<string> {
  let result: Awaited<ReturnType<typeof mammoth.extractRawText>>;

  try {
    result = await mammoth.extractRawText({ buffer: bytes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DOCX parse error";
    throw new Error(`DOCX_CORRUPT: Could not read DOCX file (${message}).`);
  }

  const cleaned = cleanExtractedText(result.value ?? "");

  if (cleaned.length < 20) {
    throw new Error(
      "DOCX_EMPTY: We could not find any text in this DOCX file. " +
        "Please make sure your resume contains text and try again."
    );
  }

  return cleaned;
}

function cleanExtractedText(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code === 9 || code === 10) {
      out += raw[i];
    } else if (code < 32 || code === 127) {
      continue;
    } else {
      out += raw[i];
    }
  }

  return out
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}
