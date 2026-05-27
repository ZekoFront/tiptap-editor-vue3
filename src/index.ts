import install from "./install";
import type { HTMLVue3TiptapEditorElement } from "./typings";

// 组件导出
export { default as TiptapEditorVue3 } from "./core/Editor.vue";
// 注：用 TiptapEditorView 别名导出，避免与 @tiptap/vue-3 自带的 EditorContent 冲突
export { default as TiptapEditorView } from "./core/EditorContent.vue";

// Composables / Hooks 导出（让用户可以自己组装编辑器）
export { useEditor } from "./core/useEditor";
export { useEditorEvents } from "./core/useEditorEvents";

// Composables 类型导出
export type {
    UseEditorOptions,
    UseEditorReturn,
    EditorContent as EditorContentValue
} from "./core/useEditor";
export type {
    UseEditorEventsOptions,
    EditorEventName,
    EditorEmitFn,
    EditorUpdatePayload
} from "./core/useEditorEvents";

// Props 配置导出（用户自定义封装编辑器时复用）
export { editorProps } from "./core/editor-props";
export type { EditorProps } from "./core/editor-props";

// Tiptap 透传
export * from "@tiptap/vue-3";
export type * from "@tiptap/vue-3";

// export * from '@tiptap/core'
// export type * from '@tiptap/core'

// 业务类型导出
export type { HTMLVue3TiptapEditorElement };

// Vue plugin install
export { install };
export default install;
