import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapStrike from "@tiptap/extension-strike";
import type { Editor } from "@tiptap/vue-3";

const Strike = TiptapStrike.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("strike"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.StrikeIcon,
                        tipText: t("toolbar.strike"),
                        shortcutKeys: "Ctrl+Shift+S",
                        command: () => {
                            editor.commands.toggleStrike();
                        }
                    }
                };
            }
        };
    }
});

export { Strike };
