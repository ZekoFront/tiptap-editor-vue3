import TextAlignPopselect from "@/components/text/TextAlignPopselect.vue";
import { t } from "@/locales";
import TiptapTextAlign from "@tiptap/extension-text-align";
import type { Editor } from "@tiptap/vue-3";

function getAlignList() {
    return [
        { label: t("textAlign.left"), value: "left" },
        { label: t("textAlign.center"), value: "center" },
        { label: t("textAlign.right"), value: "right" },
        { label: t("textAlign.justify"), value: "justify" }
    ];
}

const TextAlignment = TiptapTextAlign.extend({
    name: "extensionTextAlign",
    addOptions() {
        return {
            //@ts-ignore
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: TextAlignPopselect,
                    componentProps: {
                        isActive: editor.isActive("extensionTextAlign"),
                        isReadonly: !editor.isEditable,
                        editor,
                        alignments: getAlignList(),
                        tipText: t("toolbar.textAlign"),
                        command: (alignment: string) => {
                            editor.commands.setTextAlign(alignment);
                        }
                    }
                };
            }
        };
    }
}).configure({
    types: ["heading", "paragraph"]
});

export { TextAlignment };
