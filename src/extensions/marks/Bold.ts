import { Icons } from "@/assets/icons";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapBold from "@tiptap/extension-bold";
import type { Editor } from "@tiptap/vue-3";

const Bold = TiptapBold.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("bold"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.BoldIcon,
                        tipText: "加粗",
                        shortcutKeys: "Ctrl+B",
                        command: () => {
                            editor.commands.toggleBold();
                        }
                    }
                };
            }
        };
    }
});

export { Bold };
