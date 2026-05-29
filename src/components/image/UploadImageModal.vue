<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
        :title="t('image.modalTitle')"
        :positive-text="t('image.confirm')"
        :negative-text="t('image.cancel')"
    >
        <template #header>
            <div>{{ t("image.modalTitle") }}</div>
        </template>
        <div>
            <n-tabs type="line" animated :default-value="tabPane" :on-update:value="onUpdatedTab">
                <n-tab-pane name="upload" :tab="t('image.tabUpload')">
                    <div v-if="currentImages.length" class="list-image-group">
                        <div class="list-image-item" v-for="(item, index) in currentImages" :key="index">
                            <img :src="item.preview" :alt="item.file.name" />
                            <NIcon class="delete-icon" size="21" :title="t('image.delete')">
                                <Icons.DeleteIcon @click="removeImage(index)"></Icons.DeleteIcon>
                            </NIcon>
                        </div>
                    </div>
                    <div class="upload-input-wrap">
                        <input
                            ref="fileInputRef"
                            type="file"
                            :accept="resolvedAccept"
                            multiple
                            @change="onChangeFile"
                        />
                        <p class="upload-hint">
                            {{ t("image.chooseFile") }} · {{ resolvedAcceptHint }} · ≤
                            {{ Math.round(resolvedMaxSize / 1024 / 1024) }}MB
                        </p>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="link" :tab="t('image.tabLink')">
                    <div style="padding: 12px 0px">
                        <n-input v-model:value="imageLink" :placeholder="t('image.linkPlaceholder')" />
                    </div>
                    <p v-if="linkErrorTip" style="color: var(--red)">{{ linkErrorTip }}</p>
                </n-tab-pane>
            </n-tabs>
        </div>
        <template #action>
            <div>
                <n-button style="margin-right: 10px" @click="onNegativeClick">{{ t("image.cancel") }}</n-button>
                <n-button type="primary" :loading="uploading" @click="onPositiveClick">
                    {{ t("image.confirm") }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts" name="UploadImageModal">
import { Icons } from "@/assets/icons";
import type { Tev3DefaultConfig } from "@/core/editor-props";
import { useTev3I18n } from "@/hooks/useTev3I18n";
import { useDiscreteApi } from "@/hooks/useDiscreteApi";
import { readFileDataUrl } from "@/utils";
import { Editor } from "@tiptap/core";
import { NTabs, NTabPane, NModal, NInput, NIcon, NButton } from "naive-ui";
import { computed, ref } from "vue";

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/gif,image/webp,image/svg+xml";
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

interface PreviewItem {
    file: File;
    preview: string;
}

const props = defineProps({
    editor: {
        type: Editor,
        required: true
    },
    urlPattern: {
        type: RegExp,
        required: true
    },
    /**
     * 图片上传配置入口。约定：
     * - `defaultConfig.uploadImage.imageLink` 为函数 → 走用户自定义的链接插入逻辑；
     * - `defaultConfig.uploadImage.customUpload` 为函数 → 走用户自定义的上传逻辑；
     * - 否则使用组件内部默认实现（链接 Tab 直接 setImage、上传 Tab 转 base64 插入）。
     */
    defaultConfig: {
        type: Object as () => Tev3DefaultConfig,
        default: () => null
    }
});

const { t } = useTev3I18n();
const { message } = useDiscreteApi();

const imageLink = ref("");
const isVisible = ref(false);
const linkErrorTip = ref("");
const tabPane = ref("upload");
const currentImages = ref<PreviewItem[]>([]);
const uploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const uploadConfig = computed(() => props.defaultConfig?.uploadImage ?? {});
const resolvedAccept = computed(() => uploadConfig.value.accept || DEFAULT_ACCEPT);
const resolvedMaxSize = computed(() => uploadConfig.value.maxSize ?? DEFAULT_MAX_SIZE);
const resolvedMaxCount = computed(() => uploadConfig.value.maxCount ?? Number.POSITIVE_INFINITY);
const resolvedAcceptHint = computed(() =>
    resolvedAccept.value
        .split(",")
        .map(item => item.trim().replace(/^image\//i, ".").toLowerCase())
        .join(" / ")
);

const onUpdatedTab = (val: string) => {
    tabPane.value = val;
    linkErrorTip.value = "";
};

const onNegativeClick = () => {
    isVisible.value = false;
};

/** 校验单个文件类型 / 大小 */
function validateFile(file: File): string | null {
    const accept = resolvedAccept.value;
    const acceptList = accept.split(",").map(s => s.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const matchType = acceptList.some(rule => {
        if (rule === "" || rule === "*/*") return true;
        if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
        if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
        return fileType === rule;
    });
    if (!matchType) {
        return t("image.fileTypeError", { name: file.name, accept: resolvedAcceptHint.value });
    }
    if (file.size > resolvedMaxSize.value) {
        return t("image.fileSizeError", {
            name: file.name,
            size: Math.round(resolvedMaxSize.value / 1024 / 1024)
        });
    }
    return null;
}

const onChangeFile = (evt: Event) => {
    const input = evt.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
        const err = validateFile(file);
        if (err) {
            message.error(err);
            continue;
        }
        validFiles.push(file);
    }

    const totalCount = currentImages.value.length + validFiles.length;
    if (totalCount > resolvedMaxCount.value) {
        message.warning(t("image.fileCountError", { count: resolvedMaxCount.value }));
        validFiles.splice(resolvedMaxCount.value - currentImages.value.length);
    }

    for (const file of validFiles) {
        currentImages.value.push({
            file,
            preview: URL.createObjectURL(file)
        });
    }

    if (fileInputRef.value) fileInputRef.value.value = "";
};

const removeImage = (index: number) => {
    const item = currentImages.value[index];
    if (item) URL.revokeObjectURL(item.preview);
    currentImages.value.splice(index, 1);
};

async function handleConfirmUpload() {
    if (currentImages.value.length === 0) {
        message.warning(t("image.empty"));
        return;
    }

    const files = currentImages.value.map(item => item.file);
    const customUpload = uploadConfig.value.customUpload;

    uploading.value = true;
    try {
        if (typeof customUpload === "function") {
            // 用户自定义上传：用户负责调用 editor.commands.setImage 插入
            await customUpload(files);
        } else {
            // 内部默认：转 base64 直接插入
            for (const file of files) {
                const dataUrl = await readFileDataUrl(file);
                props.editor.commands.setImage({ src: dataUrl, alt: file.name, title: file.name });
            }
        }
        closeAndReset();
    } catch (err) {
        console.error(err);
        message.error(t("image.uploadFailed"));
    } finally {
        uploading.value = false;
    }
}

function handleConfirmLink() {
    const url = imageLink.value.trim();
    const isValid = props.urlPattern?.test(url);
    if (!url || !isValid) {
        linkErrorTip.value = t("image.linkInvalid");
        message.error(linkErrorTip.value);
        return;
    }

    const userImageLink = uploadConfig.value.imageLink;
    if (typeof userImageLink === "function") {
        userImageLink(url);
    } else {
        props.editor.commands.setImage({ src: url });
    }
    closeAndReset();
}

const onPositiveClick = () => {
    if (tabPane.value === "link") {
        handleConfirmLink();
    } else {
        handleConfirmUpload();
    }
};

function closeAndReset() {
    currentImages.value.forEach(item => URL.revokeObjectURL(item.preview));
    currentImages.value = [];
    imageLink.value = "";
    linkErrorTip.value = "";
    isVisible.value = false;
}

const initialize = () => {
    closeAndReset();
    isVisible.value = true;
    tabPane.value = "upload";
};

defineExpose({
    initialize
});
</script>

<style lang="css" scoped>
.list-image-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}
.list-image-item {
    position: relative;
    width: 130px;
    height: 60px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--tev3-border-subtle, #eee);
}
.list-image-item > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.list-image-item > .delete-icon {
    position: absolute;
    top: 2px;
    right: 3px;
    color: var(--red, #ed4014);
    cursor: pointer;
}
.upload-input-wrap {
    padding: 12px 0;
}
.upload-hint {
    margin: 6px 0 0;
    font-size: 12px;
    color: var(--tev3-text-tertiary, #999);
}
</style>
