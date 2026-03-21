import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 text-foreground hidden dark:block" />
      <Moon className="w-5 h-5 text-foreground block dark:hidden" />
    </button>
  );
};

export default ThemeToggle;
