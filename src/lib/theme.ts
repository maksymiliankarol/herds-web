const KEY = "herds-theme";
type Theme = "light" | "dark";

export function getTheme(): Theme {
  const saved = document.cookie.split("; ").find((c) => c.startsWith(`${KEY}=`))?.split("=")[1];
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const color = getComputedStyle(root).getPropertyValue("--background").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

export function setTheme(theme: Theme) {
  document.cookie = `${KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  applyTheme(theme);
}