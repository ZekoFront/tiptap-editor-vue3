import { Icons } from "@/assets/icons";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapBlockquote from "@tiptap/extension-blockquote";
import type { Editor } from "@tiptap/vue-3";

const Blockquote = TiptapBlockquote.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("blockquote"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.BlockquoteIcon,
                        tipText: "引用",
                        command: () => {
                            editor.commands.toggleBlockquote();
                        }
                    }
                };
            }
        };
    }
});

export { Blockquote };
