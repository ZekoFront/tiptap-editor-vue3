import { Editor, type AnyExtension, type JSONContent } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref, type ShallowRef } from "vue";

export type EditorContent = string | JSONContent | null;

export interface UseEditorOptions {
    /** 扩展列表（响应式 getter，便于使用方传 props.extensions） */
    extensions: () => AnyExtension[];
    /** 初始内容（HTML 字符串 或 Tiptap JSON） */
    content?: () => EditorContent;
    /** 初始是否可编辑，默认 true */
    editable?: () => boolean;
    /** 透传给 Tiptap `Editor` 的 editorProps.attributes */
    attributes?: () => Record<string, string>;
    /** 透传给 Tiptap `new Editor(...)` 的额外配置 */
    editorOptions?: () => Record<string, any> | null | undefined;
    /** 是否在 onMounted 时自动创建（默认 true） */
    autoCreate?: boolean;
    /** editor 创建后回调 */
    onReady?: (editor: Editor) => void;
    /** 内容更新回调 */
    onUpdate?: (payload: { editor: Editor; html: string; json: JSONContent }) => void;
}

export interface UseEditorReturn {
    /** Tiptap editor 实例，未就绪时为 null */
    editor: ShallowRef<Editor | null>;
    /** 当前可编辑状态（双向） */
    editable: Ref<boolean>;
    /** 当前 RTL 状态（双向） */
    rtl: Ref<boolean>;
    /** 切换可编辑状态 */
    toggleEditable: () => void;
    /** 切换 RTL */
    toggleRtl: () => void;
    /** 手动创建 editor 实例（autoCreate=false 时使用） */
    create: () => void;
    /** 销毁 editor 实例 */
    destroy: () => void;
}

/**
 * 创建并管理 Tiptap Editor 实例的组合式函数。
 *
 * - 在 onMounted 自动创建（可关闭）
 * - 在 onBeforeUnmount 自动销毁
 * - editable / rtl 改变时同步到 editor 实例
 */
export function useEditor(options: UseEditorOptions): UseEditorReturn {
    const editor = shallowRef<Editor | null>(null);
    const editable = ref(options.editable?.() ?? true);
    const rtl = ref(false);

    const create = () => {
        if (editor.value) return;

        editor.value = new Editor({
            editable: editable.value,
            extensions: options.extensions(),
            content: options.content?.() ?? "",
            editorProps: {
                attributes: options.attributes?.() ?? {}
            },
            onUpdate({ editor: editorInstance }) {
                const instance = editorInstance as unknown as Editor;
                editable.value = instance.isEditable;
                options.onUpdate?.({
                    editor: instance,
                    html: instance.getHTML(),
                    json: instance.getJSON()
                });
            },
            ...options.editorOptions?.()
        });

        if (rtl.value) {
            editor.value.view.dom.setAttribute("dir", "rtl");
        }

        options.onReady?.(editor.value);
    };

    const destroy = () => {
        editor.value?.destroy();
        editor.value = null;
    };

    watch(editable, v => {
        editor.value?.setEditable(v);
    });

    watch(rtl, v => {
        const dom = editor.value?.view.dom;
        if (!dom) return;
        if (v) dom.setAttribute("dir", "rtl");
        else dom.removeAttribute("dir");
    });

    onMounted(() => {
        if (options.autoCreate !== false) create();
    });

    onBeforeUnmount(() => {
        destroy();
    });

    return {
        editor,
        editable,
        rtl,
        toggleEditable: () => (editable.value = !editable.value),
        toggleRtl: () => (rtl.value = !rtl.value),
        create,
        destroy
    };
}
