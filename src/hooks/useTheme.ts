import { onBeforeUnmount, ref, watch, type Ref } from "vue";
import { DEFAULT_THEME, resolveTheme, type Tev3ResolvedTheme, type Tev3Theme } from "@/theme";

/**
 * 主题 hook：
 *
 * - 监听传入 `theme`（system / light / dark）；
 * - 当 `theme === 'system'` 时，监听 `prefers-color-scheme` 自动切换 light / dark；
 * - 返回 `resolvedTheme`（始终是 light 或 dark），用于绑定 `data-tev3-theme` 属性。
 *
 * @example
 *   const { resolvedTheme } = useTheme(() => props.theme);
 */
export function useTheme(themeGetter: () => Tev3Theme | undefined) {
    const resolvedTheme: Ref<Tev3ResolvedTheme> = ref(resolveTheme(themeGetter() ?? DEFAULT_THEME));

    let mql: MediaQueryList | null = null;

    const applyFromGetter = () => {
        resolvedTheme.value = resolveTheme(themeGetter() ?? DEFAULT_THEME);
    };

    const onSystemChange = () => {
        if ((themeGetter() ?? DEFAULT_THEME) === "system") {
            applyFromGetter();
        }
    };

    const bindMediaQuery = () => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        if (mql) return;
        mql = window.matchMedia("(prefers-color-scheme: dark)");
        if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
        else mql.addListener(onSystemChange);
    };

    const unbindMediaQuery = () => {
        if (!mql) return;
        if (mql.removeEventListener) mql.removeEventListener("change", onSystemChange);
        else mql.removeListener(onSystemChange);
        mql = null;
    };

    watch(
        themeGetter,
        next => {
            applyFromGetter();
            const isSystem = (next ?? DEFAULT_THEME) === "system";
            if (isSystem) bindMediaQuery();
            else unbindMediaQuery();
        },
        { immediate: true }
    );

    onBeforeUnmount(() => {
        unbindMediaQuery();
    });

    return {
        /** 实际生效的主题（light/dark） */
        resolvedTheme
    };
}
