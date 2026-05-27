<!-- 主组件（迁移自 src/text/editor.vue） -->
<template>
    <div :class="['vue3-tiptap-editor', editorWrapperClass]">
        <!-- <div v-if="props.isShowToolbar && editor" class="control-group" :class="props.editorToolkitClass">
            <div class="button-group">
                <button :class="{ 'is-active': editable }" @click="toggleEditable">Toggle editable</button>
                <button :class="{ 'is-active': nested }" @click="toggleNested">Toggle nested drag handle</button>
                <button :class="{ 'is-active': rtl }" @click="toggleRtl">Toggle RTL editor</button>
            </div>
        </div> -->
        <Toolbar
            v-if="props.isShowToolbar && editor"
            :class="[editorToolkitClass]"
            :editor="editor"
            :characterCount="characterCount"
            :defaultConfig="defaultConfig"
        />

        <div v-if="props.isEnabledContent && editor" class="vue3-tiptap-editor__body">
            <drag-handle :editor="editor" :nested="false" :compute-position-config="computePositionConfig">
                <div class="custom-drag-handle" />
            </drag-handle>

            <EditorContent
                :editor="editor"
                :editable="editable"
                :content-class="props.editorContentClass"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import Toolbar from "@/components/toolbar/Toolbar.vue";
import { extensionsArray, Table } from "@/extensions";
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
import Image from "@tiptap/extension-image";
import NodeRange from "@tiptap/extension-node-range";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import type { Editor } from "@tiptap/vue-3";
import { computed, ref } from "vue";
import { editorProps } from "./editor-props";
import EditorContent from "./EditorContent.vue";
import { useEditor } from "./useEditor";
import { useEditorEvents, type EditorUpdatePayload } from "./useEditorEvents";

const props = defineProps(editorProps);

const emit = defineEmits<{
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

const nested = ref(true);

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
        // allow to select only on depth 0
        // depth: 0,
        key: null
    }),
    // Table,
    // TableKit,
    CharacterCount.configure({
        limit: Number(props.characterCount || 10000)
    }),
    Placeholder.configure({
        placeholder: props.placeholder
    }),
    ...extensionsArray
];

const initialContent = `
          <h1>The Complete Guide to Modern Web Development</h1>
          <p>Web development has evolved significantly over the past decade. What once required multiple tools and complex setups can now be accomplished with modern frameworks and libraries that prioritize developer experience.</p>

          <img src="https://unsplash.it/500/500" alt="Random Image" />

          <p dir="rtl">تجربة سحب هذا النص توضح كيف يجب أن يلتصق شبح السحب بالمؤشر حتى داخل المحتوى من اليمين إلى اليسار.</p>

          <h2>Getting Started</h2>
          <p>Before diving into the technical details, it's important to understand the foundational concepts that make modern web development possible.</p>

          <blockquote>
            <p>"The best code is no code at all. Every new line of code you willingly bring into the world is code that has to be debugged, code that has to be read and understood." - Jeff Atwood</p>
          </blockquote>

          <p>This philosophy guides much of modern development practices, emphasizing simplicity and maintainability over complexity.</p>

          <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Component-Based Architecture</td>
              <td>Breaks down the UI into reusable components.</td>
              <td><code>&lt;MyComponent /&gt;</code></td>
            </tr>
            <tr>
              <td>Virtual DOM</td>
              <td>Improves performance by minimizing direct DOM manipulation.</td>
              <td><code>&lt;VirtualDOMComponent /&gt;</code></td>
            </tr>
          </tbody>
        </table>

          <hr>

          <h2>Key Technologies</h2>
          <p>Here are the essential technologies every web developer should be familiar with:</p>

          <ul>
            <li>HTML5 and semantic markup</li>
            <li>CSS3 with modern layout techniques
              <ul>
                <li>Flexbox for one-dimensional layouts</li>
                <li>Grid for two-dimensional layouts</li>
                <li>Custom properties (CSS variables)</li>
              </ul>
            </li>
            <li>JavaScript (ES6+)</li>
            <li>TypeScript for type safety</li>
          </ul>

          <h3>Framework Comparison</h3>
          <p>Choosing the right framework depends on your project requirements:</p>

          <ol>
            <li>React - Component-based UI library</li>
            <li>Vue - Progressive framework</li>
            <li>Angular - Full-featured platform</li>
            <li>Svelte - Compile-time framework</li>
          </ol>

          <hr>

          <h2>Best Practices</h2>
          <p>Following established best practices ensures your code remains maintainable and scalable.</p>

          <blockquote>
            <p>Always write code as if the person who ends up maintaining it is a violent psychopath who knows where you live.</p>
          </blockquote>

          <h3>Code Organization</h3>
          <p>A well-organized codebase is crucial for long-term project success. Consider these principles:</p>

          <ul>
            <li>Separation of concerns</li>
            <li>DRY (Don't Repeat Yourself)</li>
            <li>KISS (Keep It Simple, Stupid)</li>
          </ul>

          <p>By following these guidelines, you'll create applications that are easier to maintain, test, and extend over time.</p>
        `;

const { editor, editable, rtl, toggleEditable, toggleRtl } = useEditor({
    extensions: () => (props.extensions.length > 0 ? props.extensions : baseExtensions),
    content: () => initialContent,
    editable: () => props.isEditable,
    attributes: () => ({ class: props.editorContentClass }),
    editorOptions: () => props.defaultConfig
});

useEditorEvents(editor, { emit: emit as any });

const computePositionConfig = computed(() => {
    return {
        placement: rtl.value ? "right-start" : "left-start"
    } as any;
});

const toggleNested = () => {
    nested.value = !nested.value;
};
</script>
