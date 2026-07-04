import React, { useEffect, useState } from "react";

/**
 * Cycles through a list of words with a pop-in animation.
 * Usage: <RotatingWord words={["your skills", "your passion"]} />
 */
const RotatingWord = ({ words = [], interval = 2200 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="anim-rotating-word-wrap">
      <span key={index} className="anim-rotating-word-item">
        {words[index]}
      </span>
    </span>
  );
};

export default RotatingWord;
