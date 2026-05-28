import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import { UndoRedo } from "@tiptap/extensions";
import type { Editor } from "@tiptap/vue-3";

const History = UndoRedo.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return [
                    {
                        component: ButtonIcon,
                        componentProps: {
                            isActive: (editor && editor.can().chain().focus().redo().run()) || false,
                            isReadonly: !editor.isEditable,
                            icons: Icons.RedoIcon,
                            tipText: t("toolbar.redo"),
                            shortcutKeys: "Ctrl+Z",
                            command: () => {
                                editor.commands.redo();
                            }
                        }
                    },
                    {
                        component: ButtonIcon,
                        componentProps: {
                            isActive: (editor && editor.can().chain().focus().undo().run()) || false,
                            isReadonly: !editor.isEditable,
                            icons: Icons.UndoIcon,
                            tipText: t("toolbar.undo"),
                            shortcutKeys: "Ctrl+Shift+Z",
                            command: () => {
                                editor.commands.undo();
                            }
                        }
                    }
                ];
            }
        };
    }
});

export { History };
