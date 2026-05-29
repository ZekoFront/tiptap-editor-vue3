<template>
    <div
        :class="['vue3-tiptap-editor__toolbar', { 'vue3-tiptap-editor-enabled': !editor.isEditable }]"
        data-vue3-tiptap-editor-btn="true"
    >
        <component
            v-for="(item, index) in cusComponentIcon"
            v-bind="item.componentProps"
            :is="item.component"
            :key="index"
            :headingLevel="headingLevel"
            :defaultConfig="defaultConfig"
        >
        </component>
        <NTooltip placement="top" trigger="hover">
            <template #trigger>
                <button
                    class="toolbar-icon--btn"
                    :class="{ 'toolbar-icon--active': contentsActive }"
                    @click="toggleContents"
                >
                    <Icons.ContentIcon class="icon"></Icons.ContentIcon>
                </button>
            </template>
            <span>{{ t("toolbar.contents") }}</span>
        </NTooltip>
        <NTooltip placement="top" trigger="hover">
            <template #trigger>
                <button class="toolbar-icon--btn" @click="exportDocx">
                    <Icons.DocxIcon class="icon"></Icons.DocxIcon>
                </button>
            </template>
            <span>{{ t("toolbar.exportDocx") }}</span>
        </NTooltip>

        <button class="toolbar-icon--btn">
            <span style="color: var(--theme-color); font-weight: bold">{{
                editor.storage.characterCount.characters()
            }}</span>
            <span>&nbsp;/&nbsp;{{ characterCount }}</span>
        </button>
    </div>
</template>

<script lang="ts" setup name="Toolkit">
import { Icons } from "@/assets/icons";
import { useTev3I18n } from "@/hooks/useTev3I18n";
import { Editor } from "@tiptap/core";
import { saveAs } from "file-saver";
import { asBlob } from "html-docx-js-typescript";
const { t } = useTev3I18n();

const props = defineProps({
    contentsActive: {
        type: Boolean,
        default: false
    },
    characterCount: {
        type: [Number, String] as PropType<number | string>,
        default: 10000
    },
    editor: {
        type: Editor,
        required: true
    },
    headingLevel: {
        type: Number,
        default: () => {
            return 7;
        }
    },
    defaultConfig: {
        type: Object,
        default: null
    }
});

interface CusIconType {
    componentProps: object;
    component: object;
}

const cusComponentIcon = computed(() => {
    const extensions = props.editor.extensionManager.extensions;
    const tiptapExtensions = extensions.reduce<CusIconType[]>((pre, cur) => {
        const { onClick } = cur.options;
        if (typeof onClick !== "function") return pre;
        const extensionData = onClick({ editor: props.editor, extension: cur });
        return Array.isArray(extensionData) ? [...pre, ...extensionData] : [...pre, extensionData];
    }, []);
    return tiptapExtensions;
});

const exportDocx = () => {
    asBlob(props.editor.getHTML())
        .then(data => {
            saveAs(data as Blob, `DOCX_${Date.now()}.docx`);
        })
        .catch(err => {
            console.log(err);
        });
};

const emit = defineEmits<{
    (e: "toggle-contents"): void;
}>();

const toggleContents = () => {
    emit("toggle-contents");
};
</script>
