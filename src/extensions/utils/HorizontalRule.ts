import { Icons } from "@/assets/icons";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import TipTapHorizontalRule from "@tiptap/extension-horizontal-rule";
import type { Editor } from "@tiptap/vue-3";

const HorizontalRule = TipTapHorizontalRule.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            nextNodeType: "paragraph",
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("horizontalRule"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.HorizontalRuleIcon,
                        tipText: "水平分隔符",
                        command: () => {
                            editor.commands.setHorizontalRule();
                        }
                    }
                };
            }
        };
    }
});

export { HorizontalRule };
