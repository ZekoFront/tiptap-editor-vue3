// 事件总线 / emit 处理：把 Tiptap Editor 原生事件桥接到 Vue 组件 emit
import { onBeforeUnmount, watch, type ShallowRef } from "vue";
import type { Editor, JSONContent } from "@tiptap/vue-3";

/** Tiptap Editor 提供的所有事件名 */
export type EditorEventName =
    | "beforeCreate"
    | "create"
    | "update"
    | "selectionUpdate"
    | "transaction"
    | "focus"
    | "blur"
    | "destroy"
    | "contentError";

/** update 事件 emit 时的负载，比 Tiptap 原生多带 html / json，方便消费 */
export interface EditorUpdatePayload {
    editor: Editor;
    html: string;
    json: JSONContent;
}

/** Vue 组件的 emit 函数签名（兼容 defineEmits 返回的类型） */
export type EditorEmitFn = (event: string, ...args: any[]) => void;

export interface UseEditorEventsOptions {
    /** Vue 组件的 emit 函数；传入后所有事件会自动 emit 出去 */
    emit?: EditorEmitFn;
    /** 自定义事件处理器；与 emit 可同时使用，handlers 优先执行 */
    handlers?: Partial<Record<EditorEventName, (payload: any) => void>>;
    /** 哪些事件需要桥接，默认全部 */
    events?: EditorEventName[];
}

const ALL_EVENTS: EditorEventName[] = [
    "beforeCreate",
    "create",
    "update",
    "selectionUpdate",
    "transaction",
    "focus",
    "blur",
    "destroy",
    "contentError"
];

/**
 * 把 Tiptap Editor 的原生事件桥接到 Vue 组件 emit。
 *
 * - editor 实例可以异步就绪（例如 useEditor 在 onMounted 才创建），通过 watch 自动绑定
 * - 自动在 onBeforeUnmount 解绑
 * - update 事件会在 emit 前自动补上 html / json 字段
 *
 * @example
 *   const { editor } = useEditor({ ... })
 *   const emit = defineEmits(['ready', 'update', 'focus', 'blur', 'selection-update'])
 *   useEditorEvents(editor, { emit })
 */
export function useEditorEvents(
    editor: ShallowRef<Editor | null>,
    options: UseEditorEventsOptions = {}
) {
    const { emit, handlers = {}, events = ALL_EVENTS } = options;

    const listenerMap = new Map<EditorEventName, (payload: any) => void>();

    function buildListener(name: EditorEventName) {
        return (payload: any) => {
            handlers[name]?.(payload);

            if (!emit) return;

            switch (name) {
                case "create":
                    emit("ready", payload.editor);
                    break;
                case "update": {
                    const inst = payload.editor as Editor;
                    emit("update", {
                        editor: inst,
                        html: inst.getHTML(),
                        json: inst.getJSON()
                    } as EditorUpdatePayload);
                    break;
                }
                case "selectionUpdate":
                    emit("selection-update", payload);
                    break;
                case "transaction":
                    emit("transaction", payload);
                    break;
                case "focus":
                    emit("focus", payload);
                    break;
                case "blur":
                    emit("blur", payload);
                    break;
                case "destroy":
                    emit("destroy");
                    break;
                case "beforeCreate":
                    emit("before-create", payload);
                    break;
                case "contentError":
                    emit("content-error", payload);
                    break;
            }
        };
    }

    function attach(instance: Editor) {
        events.forEach(name => {
            const listener = buildListener(name);
            listenerMap.set(name, listener);
            // Tiptap on/off 接受字符串事件名
            (instance.on as any)(name, listener);
        });
    }

    function detach(instance: Editor | null) {
        if (!instance) return;
        listenerMap.forEach((listener, name) => {
            (instance.off as any)(name, listener);
        });
        listenerMap.clear();
    }

    watch(
        editor,
        (next, prev) => {
            detach(prev ?? null);
            if (next) attach(next);
        },
        { immediate: true }
    );

    onBeforeUnmount(() => {
        detach(editor.value);
    });

    return {
        /** 主动解绑，一般无需调用 */
        detach: () => detach(editor.value)
    };
}
