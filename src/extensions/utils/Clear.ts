import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import ButtonIcon from "@/components/toolbar/ButtonIcon.vue";
import { useDiscreteApi } from "@/hooks/useDiscreteApi.ts";
import { Extension } from "@tiptap/core";
import { Editor } from "@tiptap/vue-3";

const { dialog } = useDiscreteApi();
const Clear = Extension.create({
    name: "extensionClear",
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive("extensionClear"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.ClearIcon,
                        tipText: t("toolbar.clear"),
                        command: () => {
                            dialog.warning({
                                title: t("clear.title"),
                                content: t("clear.content"),
                                positiveText: t("clear.confirm"),
                                negativeText: t("clear.cancel"),
                                maskClosable: false,
                                onPositiveClick: () => {
                                    editor.commands.clearContent();
                                },
                                onMaskClick: () => {
                                    // message.success('不能关闭')
                                },
                                onEsc: () => {
                                    // message.success('通过 esc 关闭')
                                }
                            });
                        }
                    }
                };
            }
        };
    }
});

export { Clear };
