import "@tiptap/extension-text-style";
import { Icons } from "@/assets/icons";
import ImportButtonPopover from "@/components/imports/index.vue";
import { t } from "@/locales";
import { COLOR_DEFAULT } from "@/utils";
import { Extension } from "@tiptap/core";
import { Editor } from "@tiptap/vue-3";

export const Imports = Extension.create({
    name: "imports",

    addOptions() {
        return {
            ...this.parent?.(),
            types: [],
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ImportButtonPopover,
                    componentProps: {
                        editor,
                        isActive: editor.isActive("imports"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.BackgroundColorIcon,
                        colors: COLOR_DEFAULT,
                        tipText: t("toolbar.importAttachment")
                    }
                };
            }
        };
    }
});