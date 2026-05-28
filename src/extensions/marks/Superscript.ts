import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapSuperscript from "@tiptap/extension-superscript";
import type { Editor } from "@tiptap/vue-3";

const Superscript = TiptapSuperscript.extend({
    name: "Superscript",
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("Superscript"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.SuperscriptIcon,
                        tipText: t("toolbar.superscript"),
                        command: () => {
                            editor.commands.toggleSuperscript();
                        }
                    }
                };
            }
        };
    },
    addAttributes() {
        return {
            // class:{
            //     default: 'custom-superscript-class'
            // }
        };
    }
});

export { Superscript };
