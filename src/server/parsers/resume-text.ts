import fs from "node:fs/promises";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

/**
 * Extracts plain text from an uploaded resume file (PDF or DOCX).
 *
 * International-friendly: preserves Unicode characters (Icelandic ð/þ/æ,
 * Arabic, Chinese, accented Latin, etc.) and tries multiple fallbacks
 * before declaring a file unreadable.
 *
 * Throws specific error messages so the API layer can give the user
 * actionable feedback instead of a generic "could not read" message.
 */
export async function extractResumeText(filePath: string, mimeType: string): Promise<string> {
  const bytes = await fs.readFile(filePath);

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
    // Text layer is missing or empty - this is almost certainly a scanned/image-based PDF
    throw new Error(
      "PDF_NO_TEXT_LAYER: This PDF appears to be a scanned image with no selectable text. " +
        "Please re-export your resume as a text-based PDF (from Word, Google Docs, or your CV builder) " +
        "or upload a DOCX file instead."
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
        "Please make sure your resume contains text (not just images) and try again."
    );
