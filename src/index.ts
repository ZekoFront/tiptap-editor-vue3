import install from "./install";

// 组件导出
export { default as TiptapEditorVue3 } from "./core/Editor.vue";
// 注：用 TiptapEditorView 别名导出，避免与 @tiptap/vue-3 自带的 EditorContent 冲突
export { default as TiptapEditorView } from "./core/EditorContent.vue";

// Composables / Hooks 导出（让用户可以自己组装编辑器）
export { useEditor } from "./core/useEditor";
export { useEditorEvents } from "./core/useEditorEvents";

// Composables 类型导出
export type { UseEditorOptions, UseEditorReturn, EditorContent as EditorContentValue } from "./core/useEditor";
export type {
    UseEditorEventsOptions,
    EditorEventName,
    EditorEmitFn,
    EditorUpdatePayload
} from "./core/useEditorEvents";

// Props 配置导出（用户自定义封装编辑器时复用）
export { editorProps } from "./core/editor-props";
export type { EditorProps } from "./core/editor-props";

// 业务类型导出
export * from "./typings";

// Tiptap 常用 API 显式导出（避免 export * 导致 d.ts 打包失败）
export { Editor, EditorContent, NodeViewWrapper, mergeAttributes } from "@tiptap/vue-3";
export type { Editor as TiptapEditor, JSONContent, Content, AnyExtension } from "@tiptap/vue-3";

// Vue plugin install
export { install };
export default install;
