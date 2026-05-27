import type { Editor } from "@tiptap/vue-3";
import { type Ref, type ShallowRef } from "vue";

type ContextMenuExpose = {
    open: (payload: { left: number; top: number; e: MouseEvent }) => void;
};

/**
 * 编辑区右键：请先在父组件中 `const contextMenuRef = ref<ContextMenuExpose | null>(null)`，
 * 将其绑定到 ContextMenu：`ref="contextMenuRef"`，再传入本 hook。
 */
export const useContextMenu = (
    editor: ShallowRef<Editor | null>,
    contextMenuRef: Ref<ContextMenuExpose | null>
) => {
    const onContextmenu = (event: MouseEvent) => {
        const inst = editor.value;
        const menu = contextMenuRef.value;
        if (!inst || !menu) return;

        if (!inst.isActive("table")) return;

        event.preventDefault();
        menu.open({ e: event, left: event.clientX, top: event.clientY });
    };

    return {
        onContextmenu
    };
};
