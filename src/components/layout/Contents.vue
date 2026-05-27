<template>
    <div :class="['vue3-tiptap-editor__navigation', { 'is-active': isShowContent }]">
        <div class="navigation-header">
            <span>文档目录</span>
            <NIcon class="close-nav" size="25" @click="closeContents">
                <Dismiss20Filled></Dismiss20Filled>
            </NIcon>
        </div>
        <div class="navigation-directory">
            <!-- <p>文档目录：</p> -->
            <ul id="directory-container" class="directory-container"></ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ensureHeadingIds } from "@/utils";
import { Editor } from "@tiptap/vue-3";
import { Dismiss20Filled } from "@vicons/fluent";
import { NIcon } from "naive-ui";

const props = defineProps({
    editor: {
        type: Editor,
        required: true
    }
});

const isShowContent = defineModel<boolean>("isShowContent", {
    default: true,
    required: true
});

props.editor.on("update", ({ editor, transaction }) => {
    nextTick(() => {
        // const { state } = editor;
        // const { selection } = state;
        // const { $from } = selection;
        // let node = $from.node();
        // if (node.type.name === 'heading') {
        //    updateDirectory()
        // }
        // 粘贴内容比如wps文档标题，会丢失id，所以这里手动添加id
        if (!transaction.docChanged) return;
        const hasModifiedState = ensureHeadingIds(editor);

        if (hasModifiedState) {
            return;
        }

        updateDirectory();
    });
});

const updateDirectory = () => {
    const container = document.querySelector(".tiptap-editor__content");
    if (!container) return;
    // 标题 DOM 容器
    const headerContainer = document.getElementById("directory-container") as HTMLElement;
    const headers = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    if (headers && headers.length === 0) {
        headerContainer.innerHTML = `<li>暂无数据</li>`;
        return;
    }

    headerContainer.innerHTML = headers
        .map((item, index) => {
            const elementID = item.getAttribute("id") || "";
            // 不能直接修改dom节点属性，否则一直触发更新事件
            // item.setAttribute('id', elementID)
            const type = parseInt(item.tagName.slice(1));
            return `<li id="${elementID}" class="directory-item__cell" type="header${type}">${removeBrTags(item.innerHTML)}</li>`;
        })
        .join("");

    headerContainer.onmousedown = (event: any) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        // 向上查找最近的 li 元素，确保在容器内
        const targetLi = target.closest("li");
        if (!targetLi || !headerContainer.contains(targetLi)) return;
        const hId = targetLi.id;
        // 滚动到标题
        const targetElement = document.querySelector(`#${hId}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    };

    // @ts-ignore
    const li = headerContainer.childNodes;
    for (let i = 0; i < li.length; i++) {
        // @ts-ignore
        li[i].onclick = () => {
            // @ts-ignore
            li.forEach(item => {
                // @ts-ignore
                item.setAttribute("class", "directory-item__cell");
            });
            // @ts-ignore
            li[i].setAttribute("class", "directory-item__cell active");
        };
    }
};

const closeContents = () => {
    isShowContent.value = !isShowContent.value;
};

function removeBrTags(html: string) {
    // 匹配各种形式的br标签：<br>、<br/>、<br />等
    const brRegex = /<br\s*\/?>/gi;
    // 用空字符串替换所有匹配到的br标签
    return html.replace(brRegex, "");
}

onMounted(() => {
    nextTick(() => {
        updateDirectory();
    });
});
</script>
