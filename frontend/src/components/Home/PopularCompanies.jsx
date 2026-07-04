import React from "react";
import { FaMicrosoft, FaApple, FaGoogle } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    { id: 1, title: "Microsoft", location: "Hyderabad, India", icon: <FaMicrosoft />, accent: "teal" },
    { id: 2, title: "Google", location: "Bengaluru, India", icon: <FaGoogle />, accent: "coral" },
    { id: 3, title: "Tesla", location: "Austin, USA", icon: <SiTesla />, accent: "purple" },
    { id: 4, title: "Apple", location: "Cupertino, USA", icon: <FaApple />, accent: "indigo" },
  ];

  return (
    <div className="home-companies">
      <span className="home-section-eyebrow">Top Employers</span>
      <h3 className="home-section-title">Popular Companies</h3>
      <p className="home-companies-note">
        These companies and their job posts are actively featured on JobZee.
      </p>
      <div className="home-company-grid">
        {companies.map((element, idx) => (
          <div
            className={`home-company-card anim-fade-up anim-fade-up-delay-${(idx % 4) + 1}`}
            data-accent={element.accent}
            key={element.id}
          >
            <div className="home-company-top">
              <div className="home-company-icon">{element.icon}</div>
              <div>
                <h4>{element.title}</h4>
                <span>{element.location}</span>
              </div>
            </div>
            <button>Actively hiring on JobZee</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCompanies;
