<template>
    <aside
        :class="[
            'vue3-tiptap-editor__navigation',
            { 'is-active': isShowContent },
            navClass
        ]"
    >
        <div class="navigation-header">
            <span>文档目录</span>
            <NIcon class="close-nav" size="25" @click="closeContents">
                <Dismiss20Filled />
            </NIcon>
        </div>
        <div class="navigation-directory">
            <ul class="directory-container">
                <li v-if="headings.length === 0" class="directory-item__cell directory-item__empty">
                    暂无标题
                </li>
                <li
                    v-for="item in headings"
                    :key="item.id"
                    :class="['directory-item__cell', { active: activeId === item.id }]"
                    :type="`header${item.level}`"
                    @click="goToHeading(item.id)"
                >
                    {{ item.text }}
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ensureHeadingIds } from "@/utils";
import { Dismiss20Filled } from "@vicons/fluent";
import type { Editor } from "@tiptap/vue-3";
import { NIcon } from "naive-ui";
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";

export interface HeadingItem {
    id: string;
    level: number;
    text: string;
}

const props = defineProps({
    editor: {
        type: Object as PropType<Editor>,
        required: true
    },
    /** 编辑区滚动容器（.vue3-tiptap-editor__body），用于目录跳转滚动 */
    scrollContainer: {
        type: Object as PropType<HTMLElement | null>,
        default: null
    },
    navClass: {
        type: [String, Array, Object] as PropType<string | Record<string, boolean> | string[]>,
        default: undefined
    }
});

const isShowContent = defineModel<boolean>("isShowContent", {
    default: false
});

const headings = ref<HeadingItem[]>([]);
const activeId = ref<string | null>(null);

function stripHtml(html: string) {
    return html.replace(/<br\s*\/?>/gi, "").replace(/<[^>]+>/g, "").trim();
}

function updateDirectory() {
    const root = props.editor.view.dom;
    const nodes = root.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.value = Array.from(nodes).map(el => ({
        id: el.id || "",
        level: Number.parseInt(el.tagName.slice(1), 10),
        text: stripHtml(el.innerHTML) || "（无标题）"
    })).filter(item => item.id);
}

function onEditorUpdate(payload: { transaction: { docChanged: boolean } }) {
    if (!payload.transaction.docChanged) return;

    const hasModifiedState = ensureHeadingIds(props.editor);
    if (hasModifiedState) return;

    updateDirectory();
}

function findHeadingPos(id: string): number | null {
    let pos: number | null = null;
    props.editor.state.doc.descendants((node, nodePos) => {
        if (node.type.name === "heading" && node.attrs.id === id) {
            pos = nodePos;
            return false;
        }
    });
    return pos;
}

function goToHeading(id: string) {
    if (!id) return;

    activeId.value = id;

    const pos = findHeadingPos(id);
    if (pos !== null) {
        props.editor.chain().focus().setTextSelection(pos + 1).run();
    }

    nextTick(() => {
        const headingEl = props.editor.view.dom.querySelector(`#${CSS.escape(id)}`);
        const scrollEl = props.scrollContainer ?? props.editor.view.dom.closest(".vue3-tiptap-editor__body");

        if (!headingEl || !(scrollEl instanceof HTMLElement)) return;

        const offset =
            headingEl.getBoundingClientRect().top -
            scrollEl.getBoundingClientRect().top +
            scrollEl.scrollTop;

        scrollEl.scrollTo({
            top: Math.max(0, offset - 12),
            behavior: "smooth"
        });
    });
}

function closeContents() {
    isShowContent.value = false;
}

watch(isShowContent, visible => {
    if (visible) {
        nextTick(updateDirectory);
    }
});

onMounted(() => {
    props.editor.on("update", onEditorUpdate as any);
    nextTick(() => {
        ensureHeadingIds(props.editor);
        updateDirectory();
    });
});

onBeforeUnmount(() => {
    props.editor.off("update", onEditorUpdate as any);
});
</script>
