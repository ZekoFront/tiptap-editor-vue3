<!-- 主组件（迁移自 src/text/editor.vue） -->
<template>
    <div :class="['vue3-tiptap-editor', editorWrapperClass]" :data-tev3-theme="resolvedTheme">
        <Toolbar
            v-if="props.isShowToolbar && editor"
            :key="localeKey"
            :class="[editorToolkitClass]"
            :editor="editor"
            :character-count="characterCount"
            :default-config="defaultConfig"
            :contents-active="isShowContent"
            @toggle-contents="isShowContent = !isShowContent"
        />

        <div v-if="props.isEnabledContent && editor" class="vue3-tiptap-editor__main">
            <div ref="editorBodyRef" class="vue3-tiptap-editor__body">
                <drag-handle :editor="editor" :nested="false" :compute-position-config="computePositionConfig">
                    <div class="custom-drag-handle" />
                </drag-handle>

                <EditorContent
                    :editor="editor"
                    :editable="editable"
                    :content-class="props.editorContentClass"
                    @contextmenu="onContextmenu"
                />
            </div>

            <ContentsNav
                :key="localeKey"
                v-model:is-show-content="isShowContent"
                :editor="editor"
                :scroll-container="editorBodyRef"
                :nav-class="editorContentsNavClass"
            />
        </div>

        <BubbleMenus v-if="editor" :editor="editor" :customDubbleMenus="customDubbleMenus" />
        <ContextMenus v-if="editor" ref="contextMenuRef" :editor="editor" />
    </div>
</template>

<script setup lang="ts">
import BubbleMenus from "@/components/bubble-menu/index.vue";
import ContentsNav from "@/components/layout/Contents.vue";
import ContextMenus from "@/components/table/ContextMenu.vue";
import Toolbar from "@/components/toolbar/Toolbar.vue";
import { extensionsArray } from "@/extensions";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_LOCALE, setLocale, t } from "@/locales";
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
import NodeRange from "@tiptap/extension-node-range";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import type { Editor, JSONContent } from "@tiptap/vue-3";
import { computed, ref, watch } from "vue";
import { editorProps, type Tev3ModelValue } from "./editor-props";
import EditorContent from "./EditorContent.vue";
import { useEditor } from "./useEditor";
import { useEditorEvents, type EditorUpdatePayload } from "./useEditorEvents";

const props = defineProps(editorProps);

const localeKey = computed(() => props.locale ?? DEFAULT_LOCALE);

const { resolvedTheme } = useTheme(() => props.theme);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | JSONContent): void;
    (e: "ready", editor: Editor): void;
    (e: "update", payload: EditorUpdatePayload): void;
    (e: "selection-update", payload: { editor: Editor }): void;
    (e: "transaction", payload: { editor: Editor; transaction: any }): void;
    (e: "focus", payload: { editor: Editor; event: FocusEvent }): void;
    (e: "blur", payload: { editor: Editor; event: FocusEvent }): void;
    (e: "destroy"): void;
    (e: "before-create", payload: { editor: Editor }): void;
    (e: "content-error", payload: { editor: Editor; error: Error }): void;
}>();

const isShowContent = ref(false);
const editorBodyRef = ref<HTMLElement | null>(null);

const baseExtensions = [
    StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        orderedList: false,
        bulletList: false,
        underline: false,
        heading: false,
        horizontalRule: false,
        blockquote: false,
        link: false,
        undoRedo: false
    }),
    NodeRange.configure({
        key: null
    }),
    CharacterCount.configure({
        limit: Number(props.characterCount || 10000)
    }),
    Placeholder.configure({
        placeholder: () => props.placeholder ?? t("editor.placeholder")
    }),
    ...extensionsArray
];

/** 内容 v-model 同步：当前由用户输入触发的最近一次值，用于跳过 setContent 引发的回写 */
const isSameAsCurrent = (next: Tev3ModelValue) => {
    if (!editor.value) return true;
    if (next == null || next === "") return editor.value.isEmpty;
    if (typeof next === "string") return editor.value.getHTML() === next;
    return JSON.stringify(editor.value.getJSON()) === JSON.stringify(next);
};

const { editor, editable, rtl } = useEditor({
    extensions: () => (props.extensions.length > 0 ? props.extensions : baseExtensions),
    content: () => props.modelValue ?? "",
    editable: () => props.isEditable,
    attributes: () => ({ class: props.editorContentClass }),
    editorOptions: () => props.defaultConfig
});

useEditorEvents(editor, {
    emit: emit as any,
    handlers: {
        update: ({ editor: inst }: { editor: Editor }) => {
            const value = props.outputFormat === "json" ? inst.getJSON() : inst.getHTML();
            emit("update:modelValue", value);
        }
    }
});

watch(
    () => props.modelValue,
    next => {
        if (!editor.value) return;
        if (isSameAsCurrent(next)) return;
        editor.value.commands.setContent(next ?? "", { emitUpdate: false } as any);
    }
);

watch(
    () => props.locale,
    locale => {
        setLocale(locale ?? DEFAULT_LOCALE);
        editor.value?.view.dispatch(editor.value.state.tr);
    },
    { immediate: true }
);

const computePositionConfig = computed(() => {
    return {
        placement: rtl.value ? "right-start" : "left-start"
    } as any;
});

const contextMenuRef = ref<{ open: (p: { left: number; top: number; e: MouseEvent }) => void } | null>(null);
const { onContextmenu } = useContextMenu(editor, contextMenuRef);
</script>
