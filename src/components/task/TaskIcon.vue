<template>
    <NTooltip placement="top" trigger="hover">
        <template #trigger>
            <button
                :class="{
                    'toolbar-icon--btn': true,
                    'toolbar-icon--active': isActive,
                    'toolbar-icon--readonly': isReadonly
                }"
                @click="handle"
            >
                <svg viewBox="0 0 1024 1024" width="200" height="200">
                    <path
                        d="M853.333333 0a170.666667 170.666667 0 0 1 170.666667 170.666667v682.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H170.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V170.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h682.666666zM213.333333 76.8H170.666667a93.866667 93.866667 0 0 0-93.610667 87.168L76.8 170.666667v682.666666a93.866667 93.866667 0 0 0 87.168 93.610667L170.666667 947.2h682.666666a93.866667 93.866667 0 0 0 93.610667-87.168L947.2 853.333333V170.666667a93.866667 93.866667 0 0 0-87.168-93.610667L853.333333 76.8h-42.666666V213.333333a42.666667 42.666667 0 0 1-42.666667 42.666667H256a42.666667 42.666667 0 0 1-42.666667-42.666667V76.8z m596.096 296.832a38.4 38.4 0 0 1 3.413334 50.389333l-3.413334 3.925334-307.712 307.754666a38.272 38.272 0 0 1-27.818666 11.221334 38.272 38.272 0 0 1-27.776-11.221334l-187.050667-187.050666a38.4 38.4 0 1 1 54.272-54.314667l160.554667 160.512 281.216-281.173333a38.4 38.4 0 0 1 54.314666 0zM733.866667 76.8H290.133333v102.4h443.733334V76.8z"
                    ></path>
                </svg>
            </button>
        </template>
        <span>{{ tipText }}</span>
    </NTooltip>
</template>

<script setup lang="ts" name="TaskIcon">
import { Void } from "@/utils";
import { NTooltip } from "naive-ui";

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    isReadonly: {
        type: Boolean,
        default: false
    },
    tipText: {
        type: String,
        default: "任务列表"
    },
    command: {
        type: Function,
        default: Void
    }
});

const handle = () => {
    if (!props.isReadonly) {
        props.command();
    }
};
</script>
