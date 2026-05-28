<template>
    <bubble-menu v-if="editor" :editor="editor" :options="{ placement: 'bottom', offset: 8 }">
        <div
            class="bubble-menu editor-inner-bubble--menu"
            v-if="editor.isActive('paragraph') && !editor.isActive('image')"
        >
            <template v-for="item in dubbleMenusList">
                <template v-if="item.type === 'link'">
                    <button
                        v-if="editor.isActive('link')"
                        :title="item.title"
                        class="menu-button"
                        @click="item.command()"
                        :class="{ 'is-active': editor.isActive(item.type) }"
                    >
                        <component :is="item.icon" class="menu-icon"></component>
                    </button>
                </template>
                <button
                    v-else
                    :title="item.title"
                    class="menu-button"
                    @click="item.command()"
                    :class="{ 'is-active': editor.isActive(item.type) }"
                >
                    <component :is="item.icon" class="menu-icon"></component>
                </button>
            </template>
        </div>
    </bubble-menu>
</template>
<script setup lang="ts" name="ParagraphMenu">
import { Icons } from "@/assets/icons";
import type { IDubbleMenu } from "@/typings";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/vue-3/menus";

const { editor, customDubbleMenus } = defineProps({
    editor: {
        type: Editor,
        required: true
    },
    customDubbleMenus: {
        type: Array as PropType<IDubbleMenu[]>,
        default: () => []
    }
});

const dubbleMenusList = computed(() => {
    return Array.isArray(customDubbleMenus) && customDubbleMenus.length > 0
        ? [...customDubbleMenus]
        : defaultDubbleMenusList.value;
});

const defaultDubbleMenusList = shallowRef<IDubbleMenu[]>([
    {
        title: "粗体",
        icon: Icons.BoldIcon,
        type: "bold",
        command: () => {
            editor.commands.toggleBold();
        }
    },
    {
        title: "斜体",
        icon: Icons.ItalicIcon,
        type: "italic",
        command: () => {
            editor.commands.toggleItalic();
        }
    },
    {
        title: "删除线",
        icon: Icons.StrikeIcon,
        type: "strike",
        command: () => {
            editor.commands.toggleStrike();
        }
    },
    {
        title: "打开链接",
        icon: Icons.OpenLinkIcon,
        type: "link",
        command: () => {
            openLinkUrl();
        }
    },
    {
        title: "删除链接",
        icon: Icons.CancelLinkIcon,
        type: "link",
        command: () => {
            cancelLinkUrl();
        }
    }
]);

// 打开链接
const openLinkUrl = () => {
    const link = editor.getAttributes("link");
    window.open(link.href);
};

// 取消链接
const cancelLinkUrl = () => {
    editor.commands.unsetLink();
};
</script>
