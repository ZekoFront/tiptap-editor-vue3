import install from "./install";
import type { HTMLVue3TiptapEditorElement } from "./typings";

export { default as TiptapEditorVue3 } from "./core/Editor.vue";

export * from "@tiptap/vue-3";
export type * from "@tiptap/vue-3";

// export * from '@tiptap/core'
// export type * from '@tiptap/core'

export type { HTMLVue3TiptapEditorElement };

export { install };
export default install;
