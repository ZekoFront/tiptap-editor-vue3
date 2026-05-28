import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapSubscript from "@tiptap/extension-subscript";
import type { Editor } from "@tiptap/vue-3";

const Subscript = TiptapSubscript.extend({
    name: "Subscript",
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("Subscript"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.SubscriptIcon,
                        tipText: t("toolbar.subscript"),
                        command: () => {
                            editor.commands.toggleSubscript();
                        }
                    }
                };
            }
        };
    },
    addAttributes() {
        return {
            class: {
                default: "custom-subscript-class"
            }
        };
    }
});

export { Subscript };
