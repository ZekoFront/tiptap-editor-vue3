import type { App } from "vue";
import TiptapEditorVue3 from "./core/Editor.vue";
import TiptapEditorView from "./core/EditorContent.vue";
import { installTev3I18n } from "./locales";

export default function install(app: App) {
    installTev3I18n(app);
    app.component("TiptapEditorVue3", TiptapEditorVue3);
    app.component("TiptapEditorView", TiptapEditorView);
}
