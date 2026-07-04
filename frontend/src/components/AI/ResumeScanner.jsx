import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import "./AITools.css";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const ResumeScanner = () => {
  const [mode, setMode] = useState("file"); // "file" | "paste"
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  if (!isAuthorized) {
    navigateTo("/");
  }

  const isValidFile = (f) => {
    const name = f.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  };

  const handleFilePick = (f) => {
    if (!f) return;
    if (!isValidFile(f)) {
      toast.error("Please upload a PDF or Word (.doc/.docx) file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large. Please upload a file under 5MB.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFilePick(e.dataTransfer.files?.[0]);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);
    try {
      let data;
      if (mode === "file") {
        if (!file) {
          toast.error("Please choose a resume file first.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        ({ data } = await api.post("/ai/resume-scan", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }));
      } else {
        if (resumeText.trim().length < 30) {
          toast.error("Please paste at least 30 characters of resume text.");
          setLoading(false);
          return;
        }
        ({ data } = await api.post("/ai/resume-scan", { resumeText }));
      }
      setAnalysis(data.analysis);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not analyze resume.");
    }
    setLoading(false);
  };

  const scoreColor = (score) => {
    if (score >= 80) return "#1f9d55";
    if (score >= 60) return "#3a8bd6";
    if (score >= 40) return "#e0a800";
    return "#d64545";
  };

  return (
    <section className="ai-page">
      <div className="ai-container">
        <div className="ai-hero">
          <span className="ai-badge">AI Resume Tools</span>
          <h1>Resume Scanner</h1>
          <p>
            Upload your resume as a PDF or Word document — or paste the text directly.
            Our engine checks structure, skills, impact language, and
            ATS-friendliness, then gives you concrete improvement tips.
          </p>
        </div>

        <div className="ai-card">
          <div className="rs-tabs">
            <button
              type="button"
              className={`rs-tab ${mode === "file" ? "active" : ""}`}
              onClick={() => setMode("file")}
            >
              Upload File
            </button>
            <button
              type="button"
              className={`rs-tab ${mode === "paste" ? "active" : ""}`}
              onClick={() => setMode("paste")}
            >
              Paste Text
            </button>
          </div>

          <form onSubmit={handleScan}>
            {mode === "file" ? (
              <>
                <div
                  className={`rs-dropzone ${dragging ? "dragging" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="rs-drop-icon">
                    <FiUploadCloud />
                  </div>
                  <p>
                    <strong>Click to upload</strong> or drag and drop
                  </p>
                  <p className="rs-drop-hint">PDF or Word (.doc, .docx) — up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={(e) => handleFilePick(e.target.files?.[0])}
                  />
                </div>

                {file && (
                  <div className="rs-file-chip">
                    <span>
                      <FiFileText style={{ marginRight: 8 }} />
                      {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                    <button type="button" onClick={() => setFile(null)}>
                      <FiX /> Remove
                    </button>
                  </div>
                )}
              </>
            ) : (
              <textarea
                className="rs-textarea"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            )}

            <button type="submit" className="ai-submit-btn" disabled={loading}>
              {loading ? "Scanning..." : "Scan My Resume"}
            </button>
          </form>

          {analysis && (
            <div className="rs-result">
              <div className="rs-score-row">
                <div
                  className="rs-score-ring"
                  style={{ background: scoreColor(analysis.score) }}
                >
                  {analysis.score}
                </div>
                <div className="rs-score-meta">
                  <h3>{analysis.verdict}</h3>
                  <p>{analysis.wordCount} words analyzed</p>
                </div>
              </div>

              <div className="rs-grid">
                <div className="rs-info-box">
                  <h4>Matched Skills ({analysis.matchedSkills.length})</h4>
                  <div className="rs-chip-list">
                    {analysis.matchedSkills.length > 0 ? (
                      analysis.matchedSkills.map((s, i) => (
                        <span className="rs-chip" key={i}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <span>None detected</span>
                    )}
                  </div>
                </div>
                <div className="rs-info-box">
                  <h4>Action Verbs Found ({analysis.matchedActionVerbs.length})</h4>
                  <div className="rs-chip-list">
                    {analysis.matchedActionVerbs.length > 0 ? (
                      analysis.matchedActionVerbs.map((s, i) => (
                        <span className="rs-chip" key={i}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <span>None detected</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rs-info-box" style={{ marginBottom: 22 }}>
                <h4>Sections Detected</h4>
                <div className="rs-section-check">
                  {Object.entries(analysis.sectionsFound).map(([key, val]) => (
                    <span key={key} className={val ? "yes" : "no"}>
                      {key} {val ? "✓" : "✗"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rs-suggestions">
                <h4>Improvement Suggestions</h4>
                <ul>
                  {analysis.suggestions.length === 0 ? (
                    <li>Great job! No major issues found.</li>
                  ) : (
                    analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResumeScanner;
