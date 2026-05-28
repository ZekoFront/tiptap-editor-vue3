<template>
    <div class="playground">
        <RichText ref="richText" @ready="onReady" />
    </div>
</template>

<script setup lang="ts">
import RichText from "@/core/Editor.vue";
import type { Editor } from "@tiptap/vue-3";

const onReady = (editor: Editor) => {
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
