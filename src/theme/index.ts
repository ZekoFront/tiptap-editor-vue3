/* 主题：跟随系统 / 浅色 / 深色 */

export const SUPPORTED_THEMES = ["system", "light", "dark"] as const;
export type Tev3Theme = (typeof SUPPORTED_THEMES)[number];

/** 实际渲染时落到 DOM 上的主题（不含 system） */
export type Tev3ResolvedTheme = "light" | "dark";

export const DEFAULT_THEME: Tev3Theme = "system";

/** 当前生效（去 system 化）的主题 */
export function resolveTheme(theme: Tev3Theme): Tev3ResolvedTheme {
    if (theme === "light" || theme === "dark") return theme;
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
