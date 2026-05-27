import { Icons } from "@/assets/icons";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapItalic from "@tiptap/extension-italic";
import type { Editor } from "@tiptap/vue-3";

const Italic = TiptapItalic.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("italic"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.ItalicIcon,
                        shortcutKeys: "Ctrl+I",
                        tipText: "斜体",
                        command: () => {
                            editor.commands.toggleItalic();
                        }
                    }
                };
            }
        };
    }
});

export { Italic };
