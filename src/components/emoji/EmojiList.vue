<template>
    <div class="emoji-suggestion-items">
        <button
            v-for="(item, index) in items"
            :key="index"
            :class="{ 'is-selected': index === selectedIndex }"
            @click="selectItem(index)"
        >
            <span class="emoji-char">{{ item.fallbackImage ? "" : item.emoji }}</span>
            <img v-if="item.fallbackImage" :src="item.fallbackImage" class="emoji-img" />
            <span class="emoji-name">:{{ item.name }}:</span>
        </button>
        <div v-if="!items.length" class="no-result">未找到匹配的表情</div>
    </div>
</template>

<script>
export default {
    props: {
        items: { type: Array, required: true },
        command: { type: Function, required: true }
    },
    data() {
        return {
            selectedIndex: 0
        };
    },
    watch: {
        // 当过滤后的数据变化时，重置高亮索引
        items() {
            this.selectedIndex = 0;
        }
    },
    methods: {
        // 触发 Tiptap 命令插入表情
        selectItem(index) {
            const item = this.items[index];
            if (item) {
                this.command({ name: item.name });
            }
        },
        // 处理键盘事件（被主组件在 suggestion 钩子里调用）
        onKeyDown({ event }) {
            if (event.key === "ArrowUp") {
                this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
                return true;
            }
            if (event.key === "ArrowDown") {
                this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
                return true;
            }
            if (event.key === "Enter") {
                this.selectItem(this.selectedIndex);
                return true;
            }
            return false;
        }
    }
};
</script>

<style lang="scss">
.emoji-suggestion-items {
    position: fixed;
    z-index: 9999;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 0 1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    font-size: 0.9rem;
    max-height: 250px;
    overflow-y: auto;
    min-width: 160px;

    button {
        align-items: center;
        background: transparent;
        border: none;
        border-radius: 0.3rem;
        color: #333;
        display: flex;
        gap: 0.5rem;
        padding: 0.4rem 0.6rem;
        text-align: left;
        width: 100%;
        cursor: pointer;

        &.is-selected,
        &:hover {
            background: #70cff830;
            color: #000;
        }

        .emoji-img {
            width: 1.25rem;
            height: 1.25rem;
        }
    }
    .no-result {
        color: #999;
        padding: 0.5rem;
        font-size: 0.85rem;
    }
}
</style>
