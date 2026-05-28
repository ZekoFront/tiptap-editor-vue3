import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TiptapCode from "@tiptap/extension-code";
import type { Editor } from "@tiptap/vue-3";

const Code = TiptapCode.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("code"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.CodeBgIcon,
                        tipText: t("toolbar.code"),
                        command: () => {
                            editor.commands.toggleCode();
                        }
                    }
                };
            }
        };
    }
});

export { Code };
