import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import { BulletList as TiptapBulletList } from "@tiptap/extension-list";
import type { Editor } from "@tiptap/vue-3";

const BulletList = TiptapBulletList.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            itemTypeName: "listItem",
            keepMarks: false,
            keepAttributes: false,
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("bulletList"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.BulletListIcon,
                        tipText: t("toolbar.bulletList"),
                        command: () => {
                            editor.commands.toggleBulletList();
                        }
                    }
                };
            }
        };
    }
});

export { BulletList };
