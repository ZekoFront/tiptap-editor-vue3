<template>
    <NTooltip placement="top" trigger="hover">
        <template #trigger>
            <button class="toolbar-icon--btn" @click="handleUploadImg()">
                <Icons.AddImageIcon />
            </button>
        </template>
        <span>{{ tipText }}</span>
    </NTooltip>

    <UploadImageModal ref="UploadImageRef" :editor="editor" :defaultConfig="defaultConfig" :urlPattern="urlPattern">
    </UploadImageModal>
</template>

<script setup lang="ts" name="ImageIcon">
import { Icons } from "@/assets/icons";
import { t } from "@/locales";
import { Editor } from "@tiptap/core";
import { NTooltip } from "naive-ui";
import UploadImageModal from "./UploadImageModal.vue";

defineOptions({
    name: "ImageIcon",
    inheritAttrs: false
});

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    isReadonly: {
        type: Boolean,
        default: false
    },
    colors: {
        type: Array<string>,
        default: []
    },
    tipText: {
        type: String,
        default: () => t("common.noTip")
    },
    editor: {
        type: Editor,
        required: true
    },
    urlPattern: {
        type: RegExp,
        required: true
    },
    defaultConfig: {
        type: Object,
        default: () => null
    }
});

// 上传图片
interface UploadImageType {
    initialize: () => void;
}
const UploadImageRef = ref<UploadImageType | null>(null);
const handleUploadImg = () => {
    if (!props.editor.isEditable) return;
    if (UploadImageRef.value) {
        UploadImageRef.value.initialize();
    }
};
</script>
