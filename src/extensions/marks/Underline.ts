import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapUnderline from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/vue-3";

const Underline = TiptapUnderline.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("underline"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.UnderlineIcon,
                        tipText: t("toolbar.underline"),
                        shortcutKeys: "Ctrl+U",
                        command: () => {
                            editor.commands.toggleUnderline();
                        }
                    }
                };
            }
        };
    }
});

export { Underline };
