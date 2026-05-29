<template>
    <div class="playground">
        <TiptapEditorVue3
            v-model="content"
            :locale="'zh-CN'"
            :theme="'system'"
            placeholder="请输入内容..."
            :default-config="defaultConfig"
            @ready="onReady"
        />
    </div>
</template>

<script setup lang="ts">
import TiptapEditorVue3 from "@/core/Editor.vue";
import type { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
import type { Tev3DefaultConfig } from "../index";

const content = ref(`
    <h1>The Complete Guide to Modern Web Development</h1>
    <p>Web development has evolved significantly over the past decade. What once required multiple tools and complex setups can now be accomplished with modern frameworks and libraries that prioritize developer experience.</p>

    <img src="https://picsum.photos/500/500">

    <p dir="rtl">تجربة سحب هذا النص توضح كيف يجب أن يلتصق شبح السحب بالمؤشر حتى داخل المحتوى من اليمين إلى اليسار.</p>

    <h2>Getting Started</h2>
    <p>Before diving into the technical details, it's important to understand the foundational concepts that make modern web development possible.</p>

    <blockquote>
        <p>"The best code is no code at all. Every new line of code you willingly bring into the world is code that has to be debugged, code that has to be read and understood." - Jeff Atwood</p>
    </blockquote>

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

    <ul>
        <li>HTML5 and semantic markup</li>
        <li>CSS3 with modern layout techniques</li>
        <li>JavaScript (ES6+)</li>
        <li>TypeScript for type safety</li>
    </ul>
`);

let editor: Editor;

const defaultConfig: Tev3DefaultConfig = {
    uploadImage: {
        accept: "image/png,image/jpeg,image/webp",
        maxSize: 5 * 1024 * 1024, // 单张最大 5MB
        maxCount: 9,
        imageLink: (link: string) => {
            console.log(link, editor, "imageLink");
            editor?.commands.setImage({ src: link });
        },
        customUpload: async files => {
            console.log(files, editor, "customUpload");
            for (let i = 0; i < files.length; i++) {
                if (files[i]) setImageOne(files[i] as File);
            }
        }
    }
};

const setImageOne = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
        const base64 = event.target?.result as string;
        editor?.commands.setImage({ src: base64 });
    };
    reader.readAsDataURL(file);
};

const onReady = (e: Editor) => {
    editor = e;
    console.log(editor, "ready");
};
</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
}
</style>

<style scoped>
.playground {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px;
    background: #fff;
}

.playground :deep(.vue3-tiptap-editor) {
    height: 100%;
}
</style>
