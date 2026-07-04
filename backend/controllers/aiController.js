import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { analyzeResume } from "../utils/resumeAnalyzer.js";
import {
  QUIZ_QUESTIONS,
  ALLOWED_QUIZ_LENGTHS,
  pickQuizQuestions,
  scorePersonality,
} from "../utils/personalityEngine.js";
import {
  extractTextFromResumeFile,
  isSupportedResumeFile,
} from "../utils/fileTextExtractor.js";

// GET /api/v1/ai/quiz-questions?count=6|15|30
export const getQuizQuestions = catchAsyncErrors(async (req, res, next) => {
  const requestedCount = parseInt(req.query.count, 10);
  const count = ALLOWED_QUIZ_LENGTHS.includes(requestedCount) ? requestedCount : 6;

  const picked = pickQuizQuestions(count);

  // Send questions without exposing the underlying trait mapping to keep it fair.
  const questions = picked.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options.map((o, idx) => ({ index: idx, text: o.text })),
  }));

  res.status(200).json({ success: true, count, allowedLengths: ALLOWED_QUIZ_LENGTHS, questions });
});

// POST /api/v1/ai/personality-quiz
// body: { answers: [{ id: "q3", optionIndex: 1 }, ...] }
// Using {id, optionIndex} pairs (rather than a plain positional array) lets the
// quiz length vary (6 / 15 / 30) since each answer is matched back to its
// exact question in the bank instead of relying on array order.
export const submitPersonalityQuiz = catchAsyncErrors(async (req, res, next) => {
  const { answers } = req.body;

  if (
    !answers ||
    !Array.isArray(answers) ||
    !ALLOWED_QUIZ_LENGTHS.includes(answers.length)
  ) {
    return next(
      new ErrorHandler(
        `Please answer a valid quiz length (${ALLOWED_QUIZ_LENGTHS.join(", ")} questions).`,
        400
      )
    );
  }

  const questionMap = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));

  const traits = answers.map(({ id, optionIndex }) => {
    const question = questionMap.get(id);
    if (!question) return null;
    const option = question.options[optionIndex];
    return option ? option.trait : null;
  });

  if (traits.includes(null)) {
    return next(new ErrorHandler("Invalid answer option provided.", 400));
  }

  const result = scorePersonality(traits);
  res.status(200).json({ success: true, questionCount: answers.length, ...result });
});

// POST /api/v1/ai/resume-scan
// Accepts EITHER:
//   - multipart/form-data with a "resume" file field (PDF or .docx), OR
//   - JSON body { resumeText: "..." } (pasted text)
export const scanResume = catchAsyncErrors(async (req, res, next) => {
  let resumeText = req.body?.resumeText || "";

  if (req.files && req.files.resume) {
    const file = req.files.resume;

    if (!isSupportedResumeFile(file.name)) {
      return next(
        new ErrorHandler(
          "Unsupported file type. Please upload a PDF or Word (.docx) file.",
          400
        )
      );
    }

    // 5MB cap to keep parsing fast and avoid abuse.
    if (file.size > 5 * 1024 * 1024) {
      return next(new ErrorHandler("File too large. Please upload a file under 5MB.", 400));
    }

    try {
      resumeText = await extractTextFromResumeFile(file);
    } catch (err) {
      return next(new ErrorHandler(err.message || "Could not read that file.", 400));
    }
  }

  if (!resumeText || resumeText.trim().length < 30) {
    return next(
      new ErrorHandler(
        "We couldn't find enough readable text. Please upload a text-based PDF/Word file, or paste your resume text (at least 30 characters).",
        400
      )
    );
  }

  const analysis = analyzeResume(resumeText);
  res.status(200).json({ success: true, analysis });
});
