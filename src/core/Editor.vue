<!-- 主组件（迁移自 src/text/editor.vue） -->
<template>
    <div>
        <AddImageIcon class="icon"></AddImageIcon>
        <div class="control-group" v-if="editor">
            <div class="button-group">
                <button :class="{ 'is-active': editable }" @click="toggleEditable">Toggle editable</button>
                <button :class="{ 'is-active': nested }" @click="toggleNested">Toggle nested drag handle</button>
                <button :class="{ 'is-active': rtl }" @click="toggleRtl">Toggle RTL editor</button>
            </div>
        </div>

        <drag-handle v-if="editor" :editor="editor" :nested="false" :compute-position-config="computePositionConfig">
            <div class="custom-drag-handle" />
        </drag-handle>
        <editor-content :editor="editor" />
    </div>
</template>

<script setup lang="ts">
import { AddImageIcon } from "@/assets/icons";
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
import Image from "@tiptap/extension-image";
import NodeRange from "@tiptap/extension-node-range";
import { TableKit } from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";

// const NESTED_CONFIG_LTR = { edgeDetection: { threshold: -16, edges: ["left"] } };
// const NESTED_CONFIG_RTL = { edgeDetection: { threshold: -16, edges: ["right"] } };

// 响应式数据
const editor = ref<any>(null);
const editable = ref(true);
const nested = ref(true);
const rtl = ref(false);

// 计算属性
const computePositionConfig = computed(() => {
    return {
        placement: rtl.value ? "right-start" : "left-start"
    } as any;
});

// const nestedOptions = computed(() => {
//     if (!nested.value) {
//         return false;
//     }

//     return rtl.value ? NESTED_CONFIG_RTL : NESTED_CONFIG_LTR;
// });

// 方法
const toggleEditable = () => {
    editable.value = !editable.value;
};

const toggleNested = () => {
    nested.value = !nested.value;
};

const toggleRtl = () => {
    rtl.value = !rtl.value;
};

// 监听器
watch(editable, newValue => {
    if (editor.value) {
        editor.value.setEditable(newValue);
    }
});

watch(rtl, newValue => {
    if (!editor.value) {
        return;
    }

    if (newValue) {
        editor.value.view.dom.setAttribute("dir", "rtl");
    } else {
        editor.value.view.dom.removeAttribute("dir");
    }
});

// 生命周期钩子
onMounted(() => {
    editor.value = new Editor({
        onUpdate({ editor: editorInstance }) {
            editable.value = editorInstance.isEditable;
        },
        extensions: [
            StarterKit,
            Image.configure({ inline: false }),
            NodeRange.configure({
                // allow to select only on depth 0
                // depth: 0,
                key: null
            }),
            TableKit
        ],
        content: `
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
        `
    });

    if (rtl.value) {
        editor.value.view.dom.setAttribute("dir", "rtl");
    }
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style lang="scss">
::selection {
    background-color: #70cff850;
}

.ProseMirror {
    padding: 1rem 1rem 1rem 0;

    * {
        margin-top: 0.75em;
    }

    > * {
        margin-inline-start: 3rem;
    }

    .ProseMirror-widget * {
        margin-top: auto;
    }

    ul,
    ol {
        padding-inline: 1rem;
    }
}

.ProseMirror-noderangeselection {
    *::selection {
        background: transparent;
    }

    * {
        caret-color: transparent;
    }
}

.ProseMirror-selectednode,
.ProseMirror-selectednoderange {
    position: relative;

    &::before {
        position: absolute;
        pointer-events: none;
        z-index: -1;
        content: "";
        top: -0.25rem;
        left: -0.25rem;
        right: -0.25rem;
        bottom: -0.25rem;
        background-color: #70cff850;
        border-radius: 0.2rem;
    }
}

.custom-drag-handle {
    &::after {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1.25rem;
        content: "⠿";
        font-weight: 700;
        cursor: grab;
        background: #0d0d0d10;
        color: #0d0d0d50;
        border-radius: 0.25rem;
    }
}
</style>
