import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, bgColor, textColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
