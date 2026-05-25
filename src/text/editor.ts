import type { App } from "vue";
import type { HTMLVue3TiptapEditorElement } from "../typings";
import TiptapEditorVue3 from "./editor.vue";

export default function install(app: App) {
    // console.log(`%cTiptapEditorVue3_V${versions}`, "color: #eee;background:#646cff;padding:2px 5px;border-radius:4px;")
    app.component("TiptapEditorVue3", TiptapEditorVue3);
}

export { TiptapEditorVue3 };

export * from "@tiptap/vue-3";
export type * from "@tiptap/vue-3";

// export * from '@tiptap/core'
// export type * from '@tiptap/core'

export type { HTMLVue3TiptapEditorElement };
