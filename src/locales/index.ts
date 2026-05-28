import { createI18n } from "vue-i18n";
import enUS from "./en-US";
import zhCN from "./zh-CN";

/** 支持的语言（与 vue-i18n locale 一致） */
export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const;
export type Tev3Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Tev3Locale = "zh-CN";

export type Tev3MessageSchema = typeof zhCN;

const messages = {
    "zh-CN": zhCN,
    "en-US": enUS
};

/** 组件库内部 i18n 实例（扩展 onClick 等非 SFC 代码也可通过 t() 取文案） */
export const tev3I18n = createI18n({
    legacy: false,
    globalInjection: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages
});

/** 切换当前语言（由 Editor 的 locale prop 驱动） */
export function setLocale(locale: Tev3Locale | string) {
    const next = SUPPORTED_LOCALES.includes(locale as Tev3Locale) ? (locale as Tev3Locale) : DEFAULT_LOCALE;
    tev3I18n.global.locale.value = next;
}

export function getLocale(): Tev3Locale {
    return tev3I18n.global.locale.value as Tev3Locale;
}

/** 翻译函数，供扩展插件、工具函数使用 */
export function t(key: string, params?: Record<string, string | number>): string {
    return tev3I18n.global.t(key, params ?? {}) as string;
}

/** 宿主应用安装插件时注册 i18n（可选，便于在 SFC 内使用 useI18n） */
export function installTev3I18n(app: import("vue").App) {
    app.use(tev3I18n);
}

export { enUS, zhCN };
