import ColorPopover from "@/components/color/ColorPopover.vue";
import { t } from "@/locales";
import { COLOR_DEFAULT } from "@/utils";
import { Editor } from "@tiptap/core";
import TiptapColor from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

// 访问 ProseMirror API 示例
const Color = TiptapColor.extend({
    addOptions() {
        return {
            onClick: ({ editor }: { editor: Editor; t: (...args: any[]) => string }) => {
                return {
                    component: ColorPopover,
                    componentProps: {
                        editor,
                        isActive: editor.isActive("color"),
                        colors: COLOR_DEFAULT,
                        isReadonly: !editor.isEditable,
                        tipText: t("toolbar.color")
                    }
                };
            }
        };
    },

    addExtensions() {
        return [TextStyle];
    }
});

export { Color };
