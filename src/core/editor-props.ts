// props / defaults / 校验 单独抽离

import type { Tev3Locale } from "@/locales";
import type { Tev3Theme } from "@/theme";
import type { IDubbleMenu } from "@/typings";
import type { AnyExtension, JSONContent } from "@tiptap/vue-3";
import type { ExtractPropTypes, PropType } from "vue";

type ClassValue = string | any[] | Record<string, any>;

/** 编辑器内容：HTML 字符串、Tiptap JSON 或空 */
export type Tev3ModelValue = string | JSONContent | null | undefined;
/** v-model 同步内容时的格式 */
export type Tev3OutputFormat = "html" | "json";

/**
 * 图片上传相关配置（统一放在 `defaultConfig.uploadImage` 里）。
 *
 * 行为说明：
 * - `imageLink` 和 `customUpload` **是函数** → 走用户自定义上传逻辑，由用户自己 `editor.commands.setImage(...)` 插入；
 * - 否则 → 走组件内部默认实现（链接 Tab 直接插 src、上传 Tab 转 base64 插入）。
 * - `accept` / `maxSize` / `maxCount` 始终生效，组件会先做校验再交给用户回调。
 */
export interface Tev3UploadImageConfig {
    /**
     * 允许的文件类型（HTML input accept 语法）
     * @default "image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
     */
    accept?: string;
    /**
     * 单张图片大小上限（字节）
     * @default 10 * 1024 * 1024
     */
    maxSize?: number;
    /**
     * 单次最多选择的图片数量
     * @default Infinity
     */
    maxCount?: number;
    /** 通过 URL 插入图片时的回调；定义为函数则取代默认的 `editor.commands.setImage({ src })` */
    imageLink?: (url: string) => void;
    /**
     * 自定义上传：拿到用户选择的图片后，自行调用接口并 `editor.commands.setImage(...)` 插入。
     * 入参兼容 `File[]` / `FileList`（均可用 `length` + `[i]` 遍历）。
     */
    customUpload?: (files: File[] | FileList) => void | Promise<void>;
}

/**
 * 编辑器统一配置入口。
 *
 * 用法：
 * ```ts
 * const defaultConfig: Tev3DefaultConfig = {
 *     uploadImage: {
 *         imageLink: (url) => editor.commands.setImage({ src: url }),
 *         customUpload: async (files) => {
 *             for (const f of Array.from(files)) {
 *                 const url = await uploadToCDN(f);
 *                 editor.commands.setImage({ src: url });
 *             }
 *         }
 *     }
 * };
 * ```
 */
export interface Tev3DefaultConfig extends Record<string, any> {
    uploadImage?: Tev3UploadImageConfig;
}

export const editorProps = {
    /**
     * 编辑器内容（v-model 绑定值）
     * - HTML 字符串："<p>hello</p>"
     * - Tiptap JSON：{ type: 'doc', content: [...] }
     */
    modelValue: {
        type: [String, Object] as PropType<Tev3ModelValue>,
        default: ""
    },
    /**
     * `update:modelValue` 输出格式：
     * - 'html'：发送 HTML 字符串（默认）
     * - 'json'：发送 Tiptap JSON 对象
     */
    outputFormat: {
        type: String as PropType<Tev3OutputFormat>,
        default: "html"
    },
    defaultConfig: {
        type: Object as PropType<Tev3DefaultConfig>,
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
