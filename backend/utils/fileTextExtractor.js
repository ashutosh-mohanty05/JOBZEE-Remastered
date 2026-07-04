// fileTextExtractor.js
// Extracts plain text from an uploaded resume file so it can be fed into
// the resume analyzer. Supports PDF and Word (.docx / legacy .doc) files.

import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

const SUPPORTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function isSupportedResumeFile(filename = "") {
  return SUPPORTED_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

/**
 * @param {import('express-fileupload').UploadedFile} file
 * @returns {Promise<string>} extracted plain text
 */
export async function extractTextFromResumeFile(file) {
  const ext = path.extname(file.name).toLowerCase();
  const buffer = file.data && file.data.length ? file.data : fs.readFileSync(file.tempFilePath);

  if (ext === ".pdf") {
    const result = await pdfParse(buffer);
    return result.text || "";
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  if (ext === ".doc") {
    // Legacy binary .doc isn't reliably parseable without extra native deps.
    // Mammoth only supports .docx, so we surface a clear error instead of
    // silently returning garbage text.
    throw new Error(
      "Legacy .doc files aren't supported — please save/export your resume as .docx or .pdf."
    );
  }

  throw new Error("Unsupported file type. Please upload a PDF or Word (.docx) file.");
}
