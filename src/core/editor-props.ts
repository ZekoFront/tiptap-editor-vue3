// props / defaults / 校验 单独抽离

import type { Tev3Locale } from "@/locales";
import type { Tev3Theme } from "@/theme";
import type { IDubbleMenu } from "@/typings";
import type { AnyExtension } from "@tiptap/vue-3";
import type { ExtractPropTypes, PropType } from "vue";

type ClassValue = string | any[] | Record<string, any>;

export const editorProps = {
    defaultConfig: {
        type: Object as PropType<Record<string, any>>,
        default: null
    },
    extensions: {
        type: Array as PropType<AnyExtension[]>,
        default: () => []
    },
    isEditable: {
        type: Boolean,
        default: true
    },
    isShowToolbar: {
        type: Boolean,
        default: true
    },
    isEnabledContent: {
        type: Boolean,
        default: true
    },
    characterCount: {
        type: [Number, String] as PropType<number | string>,
        default: 10000
    },
    /** 界面语言，影响工具栏提示、表格菜单、占位符等 */
    locale: {
        type: String as PropType<Tev3Locale>,
        default: "zh-CN"
    },
    /** 主题：system 跟随系统 / light 浅色 / dark 深色 */
    theme: {
        type: String as PropType<Tev3Theme>,
        default: "system"
    },
    placeholder: {
        type: String,
        default: undefined
    },
    customDubbleMenus: {
        type: Array as PropType<IDubbleMenu[]>,
        default: () => []
    },
    editorWrapperClass: {
        type: [String, Array, Object] as PropType<ClassValue>,
        default: undefined
    },
    editorToolkitClass: {
        type: [String, Array, Object] as PropType<ClassValue>,
        default: undefined
    },
    editorContentClass: {
        type: String,
        default: "custom-tiptap-content"
    },
    editorContentsNavClass: {
        type: [String, Array, Object] as PropType<ClassValue>,
        default: undefined
    }
} as const;

export type EditorProps = ExtractPropTypes<typeof editorProps>;
