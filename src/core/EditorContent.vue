<!-- 仅渲染内容区，便于「只读视图」复用 -->
<!--
  使用方式：
    1) 只读视图（独立创建 editor 实例）
       <EditorContent :content="html" />
       <EditorContent :content="jsonDoc" :extensions="[StarterKit, Image]" />

    2) 绑定外部已有的 editor
       <EditorContent :editor="editor" />
-->
<template>
    <div :class="['tev3-editor-content', wrapperClass]" :data-readonly="!editable">
        <TiptapEditorContent
            v-if="innerEditor"
            :editor="innerEditor"
            :class="contentClass"
        />
    </div>
</template>

<script setup lang="ts">
import StarterKit from "@tiptap/starter-kit";
import {
    Editor,
    EditorContent as TiptapEditorContent,
    type AnyExtension,
    type JSONContent
} from "@tiptap/vue-3";
import {
    computed,
    onBeforeUnmount,
    onMounted,
    shallowRef,
    watch,
    type PropType
} from "vue";

type ContentValue = string | JSONContent | null;
type ClassValue = string | any[] | Record<string, any>;

const props = defineProps({
    /** 外部已有的 editor 实例。优先级高于 content / extensions */
    editor: {
        type: Object as PropType<Editor | null>,
        default: null
    },
    /** 内容：HTML 字符串 或 Tiptap JSON */
    content: {
        type: [String, Object] as PropType<ContentValue>,
        default: ""
    },
    /** 扩展列表。默认仅启用 StarterKit */
    extensions: {
        type: Array as PropType<AnyExtension[]>,
        default: () => []
    },
    /** 是否可编辑（默认只读） */
    editable: {
        type: Boolean,
        default: false
    },
    /** 外层容器 class */
    wrapperClass: {
        type: [String, Array, Object] as PropType<ClassValue>,
        default: undefined
    },
    /** 内容区 class */
    contentClass: {
        type: [String, Array, Object] as PropType<ClassValue>,
        default: "custom-tiptap-content"
    },
    /** 透传给 Tiptap Editor 构造函数的额外配置 */
    editorOptions: {
        type: Object as PropType<Record<string, any> | null>,
        default: null
    }
});

const emit = defineEmits<{
    (e: "update", payload: { editor: Editor; html: string; json: JSONContent }): void;
    (e: "ready", editor: Editor): void;
}>();

const internalEditor = shallowRef<Editor | null>(null);

const innerEditor = computed<Editor | null>(() => props.editor ?? internalEditor.value);

const isInternal = computed(() => !props.editor);

function createInternalEditor() {
    const extensions = props.extensions.length > 0 ? props.extensions : [StarterKit];

    internalEditor.value = new Editor({
        editable: props.editable,
        extensions,
        content: props.content ?? "",
        editorProps: {
            attributes: {
                class: typeof props.contentClass === "string" ? props.contentClass : ""
            }
        },
        onUpdate({ editor }) {
            const instance = editor as unknown as Editor;
            emit("update", {
                editor: instance,
                html: instance.getHTML(),
                json: instance.getJSON()
            });
        },
        ...props.editorOptions
    });

    emit("ready", internalEditor.value);
}

watch(
    () => props.content,
    newContent => {
        if (!isInternal.value || !internalEditor.value) return;
        const current = internalEditor.value.getHTML();
        const incoming = typeof newContent === "string" ? newContent : JSON.stringify(newContent ?? "");
        if (current === incoming) return;
        internalEditor.value.commands.setContent(newContent ?? "", { emitUpdate: false } as any);
    }
);

watch(
    () => props.editable,
    v => {
        if (isInternal.value && internalEditor.value) {
            internalEditor.value.setEditable(v);
        }
    }
);

onMounted(() => {
    if (isInternal.value) {
        createInternalEditor();
    } else {
        emit("ready", props.editor as Editor);
    }
});

onBeforeUnmount(() => {
    if (isInternal.value) {
        internalEditor.value?.destroy();
        internalEditor.value = null;
    }
});

defineExpose({
    /** 获取当前活跃的 editor 实例 */
    getEditor: () => innerEditor.value,
    getHTML: () => innerEditor.value?.getHTML() ?? "",
    getJSON: () => innerEditor.value?.getJSON() ?? null,
    getText: () => innerEditor.value?.getText() ?? "",
    setContent: (content: ContentValue) => {
        innerEditor.value?.commands.setContent(content ?? "");
    },
    focus: () => innerEditor.value?.commands.focus(),
    blur: () => innerEditor.value?.commands.blur()
});
</script>

<style lang="scss" scoped>
.tev3-editor-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100%;
    box-sizing: border-box;

    &[data-readonly="true"] {
        :deep(.ProseMirror) {
            cursor: default;
            outline: none;
        }
    }

    :deep(.ProseMirror) {
        flex: 1;
        outline: none;
        min-height: 100%;
    }
}
</style>
