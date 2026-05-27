import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
// 统一处理编辑器右键菜单
export const useContextMenu = (editor: ShallowRef<Editor>) => {
    const contextMenuRef = ref<{ open: ({ left, top, e }: { left: number; top: number; e: MouseEvent }) => {} } | null>(
        null
    );

    const onContextmenu = (event: MouseEvent) => {
        // 获取选中文本
        console.log(editor, contextMenuRef, 32211);
        const { from, to } = editor.value.state.selection;
        // 获取光标所在屏幕坐标，这个坐标显示右键菜单会导致不精准，因为光标始终保持在一个开始位置，而不是点击位置
        // 更换点击坐标来显示菜单
        const coords = editor.value.view.coordsAtPos(from);
        if (contextMenuRef.value && editor.value.isActive("table")) {
            event.preventDefault();
            // 处理其他业务
            contextMenuRef.value.open({ e: event, left: event.clientX, top: event.clientY });
        }
    };

    return {
        contextMenuRef,
        onContextmenu
    };
};
