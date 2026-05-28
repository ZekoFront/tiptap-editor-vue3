import { getLocale, setLocale, t, tev3I18n } from "@/locales";
import { computed } from "vue";

/**
 * 组件内使用 i18n，与 tev3I18n 为同一实例。
 * 不依赖 app.use(tev3I18n)，直接引入编辑器组件即可使用。
 */
export function useTev3I18n() {
    const locale = computed({
        get: () => tev3I18n.global.locale.value,
        set: (value: string) => setLocale(value)
    });

    return { t, locale, getLocale };
}
