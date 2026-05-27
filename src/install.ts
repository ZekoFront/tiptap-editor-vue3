import type { App } from "vue";
import TiptapEditorVue3 from "./core/Editor.vue";
import TiptapEditorView from "./core/EditorContent.vue";

export default function install(app: App) {
    app.component("TiptapEditorVue3", TiptapEditorVue3);
    app.component("TiptapEditorView", TiptapEditorView);
}
