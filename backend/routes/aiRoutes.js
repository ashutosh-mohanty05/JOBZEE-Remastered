import express from "express";
import {
  scanResume,
  getQuizQuestions,
  submitPersonalityQuiz,
} from "../controllers/aiController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/resume-scan", isAuthenticated, scanResume);
router.get("/quiz-questions", isAuthenticated, getQuizQuestions);
router.post("/personality-quiz", isAuthenticated, submitPersonalityQuiz);

export default router;
