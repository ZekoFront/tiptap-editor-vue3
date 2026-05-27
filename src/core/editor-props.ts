// props / defaults / 校验 单独抽离

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
    placeholder: {
        type: String,
        default: "请输入内容..."
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
