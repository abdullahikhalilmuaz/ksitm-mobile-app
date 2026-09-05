import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const lightColors = {
  background: "#F5F3FF",
  card: "rgba(255,255,255,0.7)",
  text: "#1A1A2E",
  textSecondary: "#6B7280",
  border: "rgba(255,255,255,0.2)",
  blur: "light",
  shadow: "#4B2E83",
  tabBar: "rgba(255,255,255,0.7)",
};

export const darkColors = {
  background: "#0F0A1A",
  card: "rgba(30,20,50,0.8)",
  text: "#F5F3FF",
  textSecondary: "#9CA3AF",
  border: "rgba(255,255,255,0.08)",
  blur: "dark",
  shadow: "#000000",
  tabBar: "rgba(20,15,35,0.9)",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};