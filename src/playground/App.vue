<template>
    <div class="playground">
        <!-- 
           :custom-dubble-menus="defaultDubbleMenusList" 自定义文本悬浮菜单列表，如果不传则使用默认列表
        -->
        <RichText ref="richText" @ready="onReady" />
    </div>
</template>

<script setup lang="ts">
// import { Icons } from "@/assets/icons";
import RichText from "@/core/Editor.vue";
// import type { IDubbleMenu } from "@/typings";
import type { Editor } from "@tiptap/vue-3";

let editor: Editor;
const onReady = (e: Editor) => {
    editor = e;
    console.log(editor, "ready");
};

// const defaultDubbleMenusList = shallowRef<IDubbleMenu[]>([
//     {
//         title: "粗体",
//         icon: Icons.BoldIcon,
//         type: "bold",
//         command: () => {
//             editor.commands.toggleBold();
//         }
//     },
//     {
//         title: "斜体",
//         icon: Icons.ItalicIcon,
//         type: "italic",
//         command: () => {
//             editor.commands.toggleItalic();
//         }
//     }
// ]);
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
