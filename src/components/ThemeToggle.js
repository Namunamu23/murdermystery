// src/components/ThemeToggle.js

import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="toggle-icon" />
      ) : (
        <MoonIcon className="toggle-icon" />
      )}
    </button>
  );
}

export default ThemeToggle;
