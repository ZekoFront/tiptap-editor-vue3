<template>
    <n-popover
        content-class="toolbar-emoji-picker__popover"
        style="width: 300px; background: transparent"
        trigger="click"
        placement="bottom"
    >
        <template #trigger>
            <n-tooltip placement="top" trigger="hover">
                <template #trigger>
                    <button class="toolbar-icon--btn">
                        <Icons.EmojiIcon />
                    </button>
                </template>
                <span>{{ tipText }}</span>
            </n-tooltip>
        </template>
        <div class="emoji-picker__wrap">
            <EmojiPicker :native="true" display-recent @select="onSelectEmoji" />
        </div>
    </n-popover>
</template>
<script setup lang="ts">
import { Icons } from "@/assets/icons";
import { Editor } from "@tiptap/vue-3";
import "vue3-emoji-picker/css";
import EmojiPicker, { type EmojiExt } from "vue3-emoji-picker";

defineOptions({ name: "EmojiIcon", inheritAttrs: false });

const props = defineProps({
    editor: {
        type: Editor,
        required: false
    },
    tipText: {
        type: String,
        default: "暂无提示"
    },
    icons: {
        type: Object as PropType<Component>,
        default: () => ({})
    }
});

function onSelectEmoji(emoji: EmojiExt) {
    props.editor?.commands.insertContent(emoji.i);
}
</script>

<style lang="scss">
.toolbar-emoji-picker__popover {
    &.n-popover__content {
        padding: 0px !important;
    }
    .v3-emoji-picker {
        margin: 0px !important;
        width: 300px;
    }
}
</style>
