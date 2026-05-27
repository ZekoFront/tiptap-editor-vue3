<template>
    <n-dropdown
        placement="bottom-start"
        trigger="manual"
        :x="xRef"
        :y="yRef"
        :options="menuList"
        :show="showDropdown"
        :on-clickoutside="onClickoutside"
        @select="handleSelect"
    />
</template>

<script lang="ts" setup name="ContextMenu">
import { type ITableContextMenuItem } from "@/typings/index";
import { Editor, Extension } from "@tiptap/vue-3";
import { NDropdown } from "naive-ui";
import { type DropdownMixedOption, type DropdownOption } from "naive-ui/es/dropdown/src/interface";
import { computed, nextTick, ref, type PropType } from "vue";

const props = defineProps({
    editor: {
        type: Object as PropType<Editor | null>,
        default: null
    },
    isVisible: {
        type: Boolean,
        default: false
    },
    coordsX: {
        type: Number,
        default: 0
    },
    coordsY: {
        type: Number,
        default: 0
    },
    onClose: {
        type: Function,
        default: () => {
            return () => void {};
        }
    }
});

const showDropdown = ref(props.isVisible);
const xRef = ref(0);
const yRef = ref(0);

function handleSelect(key: string | number, option: DropdownOption) {
    const item = option as ITableContextMenuItem;
    if (item.command) {
        item.command();
    }
    showDropdown.value = false;
    // message.info(String(key));
}
function open({ left, top, e }: { left: number; top: number; e: MouseEvent }) {
    e.preventDefault();
    showDropdown.value = false;
    nextTick().then(() => {
        showDropdown.value = true;
        xRef.value = left;
        yRef.value = top;
    });
}

const menuList = computed(() => {
    let arr: ITableContextMenuItem[] = [];
    if (!props.editor) return [];
    const { extensions } = props.editor.extensionManager;
    const table = extensions.find(el => el.name === "table") as Extension;
    if (table) {
        const { onClick } = table.options;
        if (typeof onClick === "function") {
            const opt = onClick({ editor: props.editor });
            arr = opt.componentProps.options;
        } else arr = [];
    }
    return arr as DropdownMixedOption[];
});

function onClickoutside() {
    // message.info("clickoutside");
    showDropdown.value = false;
    props.onClose(showDropdown.value);
}
defineExpose({
    open,
    onClickoutside
});
</script>
