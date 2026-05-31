<template>
    <n-dropdown :options="options" @select="handleSelect">
        <button class="toolbar-icon--btn">
            <Icons.ImportIcon />
            <svg viewBox="0 0 1024 1024" width="200" height="200">
                <path d="M209.656 344.031l298.604 335.938 306.084-335.839-604.688-0.099z"></path>
            </svg>
        </button>
    </n-dropdown>
</template>
<script setup lang="ts">
defineOptions({ name: "ImportButton", inheritAttrs: false });

import { Icons } from "@/assets/icons";
import { useDiscreteApi } from "@/hooks/useDiscreteApi";
import { Editor } from "@tiptap/vue-3";
import mammoth from "mammoth";

const { message } = useDiscreteApi();

const props = defineProps({
    editor: {
        type: Editor,
        required: true
    },
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
        default: "暂无提示"
    }
});

const options = shallowRef([
    {
        label: "导入doc文件",
        key: "doc"
    },
    {
        label: "导入txt文件",
        key: "txt"
    }
]);

const handleSelect = (key: string) => {
    console.log("key:", key);
    const acceptTypes = {
        doc: ".doc,.docx",
        txt: ".txt"
    };
    importJsonToCanvas(key === "doc" ? acceptTypes.doc : acceptTypes.txt, key);
};

const importJsonToCanvas = (accept: string, key: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = false;
    input.style.display = "none";
    document.body.appendChild(input);
    input.click();
    // 核心处理逻辑
    input.onchange = e => {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) {
            input.remove();
            return;
        }

        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const jsonStr = evt.target?.result as string;
                if (!jsonStr) console.log("content is null");
                if (key === "txt") {
                    props.editor.commands.setContent(jsonStr, {
                        parseOptions: {
                            preserveWhitespace: "full"
                        }
                    });
                } else {
                    if (target.files) {
                        importDocxToTiptap(target.files[0] as File);
                    }
                }
                message.success(`导入文件内容成功`);
            } catch (error) {
                console.error("导入出错:", error);
                message.error("导入失败: " + (error instanceof Error ? error.message : "格式错误"));
            } finally {
                // 确保在读取完成后移除 input
                input.remove();
            }
        };

        reader.onerror = () => {
            message.error("文件读取发生错误");
            input.remove();
        };

        reader.readAsText(target.files[0] as File);
    };

    input.oncancel = () => {
        input.remove();
    };
};

const importDocxToTiptap = async (file: File) => {
    console.log("file:", file);
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = async evt => {
        try {
            const arrayBuffer = evt.target?.result as ArrayBuffer;
            const result = await mammoth.convertToHtml({ arrayBuffer });

            props.editor.commands.setContent(result.value);
        } catch (error) {
            console.error("Mammoth 转换失败:", error);
        }
    };
};
</script>

<style lang="scss" scoped></style>
