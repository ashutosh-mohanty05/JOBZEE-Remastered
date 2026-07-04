import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const PopularCategories = () => {
  const categories = [
    { id: 1, title: "Graphics & Design", subTitle: "310 people hired", icon: <MdOutlineDesignServices />, accent: "pink" },
    { id: 2, title: "Mobile App Development", subTitle: "540 people hired", icon: <TbAppsFilled />, accent: "indigo" },
    { id: 3, title: "Frontend Web Development", subTitle: "215 people hired", icon: <MdOutlineWebhook />, accent: "teal" },
    { id: 4, title: "MERN Stack Development", subTitle: "1,020 people hired", icon: <FaReact />, accent: "coral" },
    { id: 5, title: "Account & Finance", subTitle: "160 people hired", icon: <MdAccountBalance />, accent: "amber" },
    { id: 6, title: "Artificial Intelligence", subTitle: "890 people hired", icon: <GiArtificialIntelligence />, accent: "purple" },
    { id: 7, title: "Video Animation", subTitle: "55 people hired", icon: <MdOutlineAnimation />, accent: "green" },
    { id: 8, title: "Game Development", subTitle: "95 people hired", icon: <IoGameController />, accent: "coral" },
  ];

  return (
    <div className="home-categories">
      <div className="home-categories-inner">
        <span className="home-section-eyebrow">Browse by field</span>
        <h3 className="home-section-title">Popular Categories</h3>
        <div className="home-cat-grid">
          {categories.map((element) => (
            <div className="home-cat-card" data-accent={element.accent} key={element.id}>
              <div className="home-cat-icon">{element.icon}</div>
              <div>
                <h4>{element.title}</h4>
                <span>{element.subTitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
