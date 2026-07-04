import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const STEPS = [
  {
    icon: <FaUserPlus />,
    title: "Create an Account",
    description:
      "Sign up in seconds with email or your Google account — no forms, no hassle.",
    accent: "indigo",
  },
  {
    icon: <MdFindInPage />,
    title: "Find or Post a Job",
    description:
      "Browse AI-ranked job matches as a seeker, or post openings in minutes as an employer.",
    accent: "teal",
  },
  {
    icon: <IoMdSend />,
    title: "Apply or Hire",
    description:
      "Apply with one click, or review applications and connect with the right candidates fast.",
    accent: "coral",
  },
];

const HowItWorks = () => {
  return (
    <div className="home-how">
      <span className="home-section-eyebrow">Simple Process</span>
      <h3 className="home-section-title">How JobZee Works</h3>
      <div className="home-how-grid">
        {STEPS.map((step, idx) => (
          <div className="home-how-card" data-accent={step.accent} key={step.title}>
            <div className="home-how-step">{idx + 1}</div>
            <div className="icon">{step.icon}</div>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
