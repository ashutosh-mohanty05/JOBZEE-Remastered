import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import api from "../../utils/api";
import toast from "react-hot-toast";
import "./AITools.css";

const LENGTH_OPTIONS = [
  { count: 6, label: "Quick", time: "~2 min" },
  { count: 15, label: "Balanced", time: "~5 min" },
  { count: 30, label: "In-depth", time: "~10 min" },
];

const PersonalityHelper = () => {
  const [stage, setStage] = useState("pick"); // "pick" | "quiz" | "result"
  const [questionCount, setQuestionCount] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]); // [{id, optionIndex}]
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  if (!isAuthorized) {
    navigateTo("/");
  }

  const startQuiz = async (count) => {
    setLoading(true);
    setQuestionCount(count);
    try {
      const { data } = await api.get(`/ai/quiz-questions?count=${count}`);
      setQuestions(data.questions);
      setAnswers([]);
      setCurrent(0);
      setStage("quiz");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load quiz.");
    }
    setLoading(false);
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/personality-quiz", { answers: finalAnswers });
      setResult(data);
      setStage("result");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not score quiz.");
    }
    setLoading(false);
  };

  const handleSelect = (optionIndex) => {
    const questionId = questions[current].id;
    const newAnswers = [...answers, { id: questionId, optionIndex }];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const goBack = () => {
    if (current === 0) return;
    setAnswers(answers.slice(0, -1));
    setCurrent(current - 1);
  };

  const restart = () => {
    setStage("pick");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setResult(null);
    setQuestionCount(null);
  };

  const maxScore = result ? Math.max(1, ...Object.values(result.scores)) : 1;

  return (
    <section className="ai-page">
      <div className="ai-container">
        <div className="ai-hero">
          <span className="ai-badge">AI Career Tools</span>
          <h1>Career Personality Helper</h1>
          <p>
            Answer a few quick questions and get AI-driven career
            recommendations based on a work-style personality model.
          </p>
        </div>

        <div className="ai-card">
          {stage === "pick" && (
            <>
              <h3 style={{ marginBottom: 16, color: "#101828" }}>
                How many questions would you like?
              </h3>
              <div className="ch-count-grid">
                {LENGTH_OPTIONS.map((opt) => (
                  <div
                    key={opt.count}
                    className={`ch-count-card ${
                      questionCount === opt.count ? "selected" : ""
                    }`}
                    onClick={() => startQuiz(opt.count)}
                  >
                    <div className="ch-count-number">{opt.count}</div>
                    <div className="ch-count-label">{opt.label}</div>
                    <div className="ch-count-time">{opt.time}</div>
                  </div>
                ))}
              </div>
              {loading && <p className="ai-loading">Loading quiz...</p>}
            </>
          )}

          {stage === "quiz" && questions.length > 0 && (
            <div>
              <div className="ch-progress-label">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="ch-progress-track">
                <div
                  className="ch-progress-fill"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>

              <h3 className="ch-question">{questions[current].question}</h3>

              <div className="ch-options">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt.index}
                    className="ch-option-btn"
                    onClick={() => handleSelect(opt.index)}
                    disabled={loading}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {current > 0 && (
                <button className="ch-back-btn" onClick={goBack}>
                  ← Back to previous question
                </button>
              )}
            </div>
          )}

          {stage === "result" && result && (
            <div>
              <div className="ch-result-trait">
                <span className="ai-badge">
                  Based on {result.questionCount} questions
                </span>
                <h2>
                  {result.dominantTraits.length > 1 ? "Your Dominant Traits: " : "Your Dominant Trait: "}
                  {result.dominantTraits.join(" & ")}
                </h2>
              </div>

              <div className="ch-scores">
                {Object.entries(result.scores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([trait, val]) => (
                    <div className="ch-score-row" key={trait}>
                      <span>{trait}</span>
                      <div className="ch-score-bar-track">
                        <div
                          className="ch-score-bar-fill"
                          style={{ width: `${(val / maxScore) * 100}%` }}
                        />
                      </div>
                      <span>{val}</span>
                    </div>
                  ))}
              </div>

              <h3 style={{ marginBottom: 14, color: "#101828" }}>
                Recommended Career Paths &amp; Tips
              </h3>
              {result.recommendations.map((rec) => (
                <div className="ch-rec-card" key={rec.trait}>
                  <h4>{rec.trait}</h4>
                  <p>
                    <strong>Suggested Roles:</strong> {rec.suggestedRoles.join(", ")}
                  </p>
                  <p>
                    <strong>Improvement Tip:</strong> {rec.improvementTip}
                  </p>
                </div>
              ))}

              <button className="ch-retake-btn" onClick={restart}>
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalityHelper;
