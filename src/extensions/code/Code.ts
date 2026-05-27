import { Icons } from "@/assets/icons";
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
                        tipText: "文本标签",
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
