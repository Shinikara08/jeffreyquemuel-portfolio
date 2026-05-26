"use client";

import { useEffect, useState } from "react";

const TITLES = [
  "AI Systems Engineer",
  "Data Expert",
  "CRM Developer",
  "Software Developer",
  "Android App Developer",
];

export default function RotatingTitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fade = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % TITLES.length);
        setVisible(true);
      }, 500);
    }, 3500);

    return () => window.clearInterval(fade);
  }, []);

  return (
    <span
      className={`inline-block transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {TITLES[index]}
    </span>
  );
}
