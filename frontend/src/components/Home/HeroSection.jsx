import React from "react";
import { Link } from "react-router-dom";
import { FaSuitcase, FaShieldAlt, FaBolt, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlinePsychology } from "react-icons/md";
import RotatingWord from "./RotatingWord";

const HeroSection = () => {
  const highlights = [
    { id: 1, title: "Live Listings", subTitle: "Updated Regularly", icon: <FaSuitcase />, accent: "teal" },
    { id: 2, title: "Verified Employers", subTitle: "Real Companies", icon: <FaShieldAlt />, accent: "coral" },
    { id: 3, title: "AI Career Tools", subTitle: "Resume + Personality", icon: <MdOutlinePsychology />, accent: "purple" },
    { id: 4, title: "Fast Apply", subTitle: "One-Click Applications", icon: <FaBolt />, accent: "amber" },
  ];

  return (
    <div className="home-hero">
      <div className="home-hero-inner">
        <div className="home-hero-text">
          <span className="home-hero-badge anim-fade-up">
            <HiSparkles /> AI-Powered Job Platform
          </span>
          <h1 className="anim-fade-up anim-fade-up-delay-1">
            Find a job that fits{" "}
            <RotatingWord
              words={["your skills", "your passion", "your future", "your ambitions"]}
            />
          </h1>
          <p className="anim-fade-up anim-fade-up-delay-3">
            JobZee pairs a classic job board with AI tools built for your
            career: scan your resume for instant feedback, discover your
            ideal career path, and get job matches ranked by fit — all in
            one place.
          </p>
          <div className="home-hero-ctas anim-fade-up anim-fade-up-delay-4">
            <Link to="/job/getall" className="home-btn-primary">
              Explore Jobs <FaArrowRight />
            </Link>
            <Link to="/resume-scanner" className="home-btn-secondary">
              Try AI Resume Scanner
            </Link>
          </div>
          <div className="home-stats anim-fade-up anim-fade-up-delay-5">
            {highlights.map((element) => (
              <div className="home-stat-card" data-accent={element.accent} key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="num">{element.title}</div>
                <div className="label">{element.subTitle}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="home-hero-visual anim-fade-up anim-fade-up-delay-2">
          <img src="/heroS.jpg" alt="People finding jobs" className="anim-float" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
