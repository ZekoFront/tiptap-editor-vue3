import { Icons } from "@/assets/icons";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import { OrderedList as TiptapOrderedList } from "@tiptap/extension-list";
import type { Editor } from "@tiptap/vue-3";
const OrderedList = TiptapOrderedList.extend({
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
                        isActive: editor.isActive("orderedList"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.OrderedListIcon,
                        tipText: "有序列表",
                        command: () => {
                            editor.commands.toggleOrderedList();
                        }
                    }
                };
            }
        };
    }
});

export { OrderedList };
