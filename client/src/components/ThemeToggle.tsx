import React, { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        id="themeToggle"
        aria-label="toggle theme"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default ThemeToggle;
