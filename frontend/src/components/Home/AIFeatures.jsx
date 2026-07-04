import React from "react";
import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { MdOutlinePsychology } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa";

const AI_FEATURES = [
  {
    icon: <FiFileText />,
    title: "AI Resume Scanner",
    description:
      "Upload your resume as a PDF or Word file and get an instant score, skill match breakdown, and concrete suggestions to make it stronger.",
    to: "/resume-scanner",
    cta: "Scan my resume",
  },
  {
    icon: <MdOutlinePsychology />,
    title: "AI Career Helper",
    description:
      "Take a quick 6, 15, or 30-question personality quiz and get career path recommendations tailored to how you actually work.",
    to: "/personality-helper",
    cta: "Discover my path",
  },
  {
    icon: <TbTargetArrow />,
    title: "AI Job Matching",
    description:
      "Your skills are matched against live job listings so you see the roles most relevant to you first, ranked by fit.",
    to: "/ai-recommendations",
    cta: "See my matches",
  },
];

const AIFeatures = () => {
  return (
    <div className="home-ai-section">
      <div className="home-ai-grid">
        {AI_FEATURES.map((feature, idx) => (
          <div
            className={`home-ai-card anim-fade-up anim-fade-up-delay-${idx + 1}`}
            key={feature.title}
          >
            <div className="home-ai-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to={feature.to} className="home-ai-link">
              {feature.cta} <FaArrowRight />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIFeatures;
