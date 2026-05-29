## tiptap-editor-vue3

简体中文 | [English](./README.en.md)

> 基于 [Tiptap 3](https://tiptap.dev/) + Vue 3 + TypeScript + Vite 开发的高质量富文本编辑器组件库。

- 开箱即用：工具栏、气泡菜单、表格右键菜单、目录侧栏、图片浮动选中等全部内置
- 内置中英文国际化（基于 vue-i18n）
- 支持浅色 / 深色 / 跟随系统三种主题，CSS 变量可自由定制
- 完整 TypeScript 类型，支持按需导入与 Hooks 二次组装
- 在线演示：**https://zekofront.github.io/tiptap-editor-vue3/**

---

## 功能清单

| 分类 | 已实现功能 |
| ---- | ---------- |
| **文字标记** | 加粗、斜体、下划线、删除线、高亮、字体颜色、背景颜色、上标、下标、行内代码 |
| **块级节点** | 标题（H1–H6）、段落、无序列表、有序列表、**任务列表**（可勾选）、引用块、分隔线、**代码块**（lowlight 语法高亮）、图片、表格、超链接、**Emoji**（`:` 触发） |
| **布局与行为** | 文本对齐（左 / 中 / 右 / 两端）、行间距、拖拽手柄（拖动块）、RTL 阿拉伯文方向 |
| **编辑体验** | 顶部工具栏、选区气泡菜单、图片气泡菜单、表格右键菜单、目录侧栏（文档导航）、占位符、字符数限制、撤销 / 重做、清空文档、导出 **DOCX** |
| **组件级能力** | 只读视图（`TiptapEditorView`）、`useEditor` / `useEditorEvents` Hooks 自行组装、浅色 / 深色 / 系统主题、zh-CN / en-US 国际化、可自定义气泡菜单按钮、CSS 变量主题定制 |

---

## 安装

```bash
npm install tiptap-editor-vue3
# 或
pnpm add tiptap-editor-vue3
# 或
yarn add tiptap-editor-vue3
```

> 项目需要 **Vue 3** 环境（仅 Vue 为外部依赖，其它依赖如 Tiptap、naive-ui、vue-i18n 等已打入产物）。

---

## 快速开始

### 方式一：全局安装（推荐）

```ts
// main.ts
import { createApp } from "vue";
import TiptapEditorVue3 from "tiptap-editor-vue3";
import "tiptap-editor-vue3/dist/css/style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(TiptapEditorVue3);
app.mount("#app");
```

```vue
<!-- App.vue -->
<template>
    <TiptapEditorVue3
        v-model="content"
        :is-editable="true"
        :character-count="20000"
        locale="zh-CN"
        theme="system"
        placeholder="请输入内容..."
        @ready="onReady"
        @update="onUpdate"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor, EditorUpdatePayload } from "tiptap-editor-vue3";

const content = ref("<p>初始内容</p>");

const onReady = (editor: Editor) => {
    console.log("editor ready", editor);
};

const onUpdate = ({ html, json }: EditorUpdatePayload) => {
    console.log(html, json);
};
</script>
```

> 使用 `v-model` 双向绑定内容。传入 HTML 字符串（默认）或 Tiptap JSON 对象；通过 `outputFormat` prop 切换 `update:modelValue` 发送的格式。

### 方式二：按需导入

```vue
<template>
    <TiptapEditorVue3 v-model:is-editable="editable" @update="onUpdate" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TiptapEditorVue3, type EditorUpdatePayload } from "tiptap-editor-vue3";
import "tiptap-editor-vue3/dist/css/style.css";

const editable = ref(true);
const onUpdate = (p: EditorUpdatePayload) => console.log(p.html);
</script>
```

### 只读视图

```vue
<template>
    <TiptapEditorView :editor="editor" />
</template>

<script setup lang="ts">
import { TiptapEditorView, useEditor } from "tiptap-editor-vue3";
import StarterKit from "@tiptap/starter-kit";

const { editor } = useEditor({
    extensions: () => [StarterKit],
    content: () => "<p>Hello</p>",
    editable: () => false
});
</script>
```

---

## Props（参数列表）

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `modelValue` (`v-model`) | `string \| JSONContent \| null` | `""` | 编辑器内容；支持 HTML 字符串或 Tiptap JSON |
| `outputFormat` | `'html' \| 'json'` | `'html'` | `update:modelValue` 发送的格式 |
| `defaultConfig` | `Record<string, any> \| null` | `null` | 透传给底层 `new Editor(...)` 的额外配置 |
| `extensions` | `AnyExtension[]` | `[]` | 自定义扩展数组；不传则使用内置完整扩展集 |
| `isEditable` | `boolean` | `true` | 是否可编辑 |
| `isShowToolbar` | `boolean` | `true` | 是否显示顶部工具栏 |
| `isEnabledContent` | `boolean` | `true` | 是否渲染内容区（关闭时仅工具栏） |
| `characterCount` | `number \| string` | `10000` | 字符数限制；超过禁止输入 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 界面语言（工具栏提示、表格菜单、占位符等） |
| `theme` | `'system' \| 'light' \| 'dark'` | `'system'` | 主题色彩；`system` 跟随操作系统 `prefers-color-scheme` |
| `placeholder` | `string` | i18n 默认值 | 空文档占位符；不传时使用当前语言默认值 |
| `customDubbleMenus` | `IDubbleMenu[]` | `[]` | 自定义气泡菜单按钮列表 |
| `editorWrapperClass` | `string \| any[] \| Record<string, any>` | `undefined` | 最外层容器自定义类 |
| `editorToolkitClass` | `string \| any[] \| Record<string, any>` | `undefined` | 工具栏自定义类 |
| `editorContentClass` | `string` | `'custom-tiptap-content'` | 内容区 ProseMirror 容器类 |
| `editorContentsNavClass` | `string \| any[] \| Record<string, any>` | `undefined` | 目录侧栏自定义类 |

> `IDubbleMenu` 等类型从包内导出：`import type { IDubbleMenu, EditorProps } from "tiptap-editor-vue3"`。

---

## Events（事件列表）

| 事件 | 负载（payload） | 说明 |
| ---- | --------------- | ---- |
| `update:modelValue` | `string \| JSONContent` | 内容变化（`v-model` 同步）；默认 HTML 字符串，`outputFormat="json"` 时为 JSON |
| `ready` | `editor: Editor` | 编辑器实例创建完成，等价于 Tiptap `create` |
| `update` | `{ editor, html, json }` | 内容变化；`html` / `json` 已自动获取，无需再调用 `editor.getHTML()` |
| `selection-update` | `{ editor }` | 光标 / 选区变化 |
| `transaction` | `{ editor, transaction }` | 任意 ProseMirror 事务 |
| `focus` | `{ editor, event: FocusEvent }` | 编辑器获得焦点 |
| `blur` | `{ editor, event: FocusEvent }` | 编辑器失去焦点 |
| `before-create` | `{ editor }` | 实例创建前 |
| `content-error` | `{ editor, error }` | 解析初始内容失败 |
| `destroy` | — | 实例销毁 |

`update` 事件负载类型：

```ts
import type { EditorUpdatePayload } from "tiptap-editor-vue3";

interface EditorUpdatePayload {
    editor: Editor;
    html: string;
    json: JSONContent;
}
```

---

## 图片上传

图片上传统一通过 `defaultConfig.uploadImage` 配置，规则非常简单：

- `imageLink` / `customUpload` **是函数** → 走用户自定义逻辑，弹窗把 URL / 文件交给你，由你自己 `editor.commands.setImage(...)` 插入；
- 否则 → 走组件内部默认实现（链接 Tab 直接 `setImage({ src })`、上传 Tab 转 base64 插入）。

`accept` / `maxSize` / `maxCount` 始终生效，组件先做校验再交给用户回调；用户没选图片就点"立即上传"时会弹本地化提示。

> 自定义图片上传，**严格遵循下面配置规则，否则不生效**：

```vue
<template>
    <TiptapEditorVue3
        v-model="content"
        :default-config="defaultConfig"
        @ready="onReady"
    />
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import type { Editor, Tev3DefaultConfig } from "tiptap-editor-vue3";

const editors = shallowRef<Editor | null>(null);

const onReady = (editor: Editor) => {
    editors.value = editor;
};

const defaultConfig: Tev3DefaultConfig = {
    uploadImage: {
        accept: "image/png,image/jpeg,image/webp",
        maxSize: 5 * 1024 * 1024, // 单张最大 5MB
        maxCount: 9,
        imageLink: (link: string) => {
            console.log(link, editors.value, "imageLink");
            editors.value?.commands.setImage({ src: link });
        },
        customUpload: async (files) => {
            console.log(files, editors.value, "customUpload");
            for (let i = 0; i < files.length; i++) {
                if (files[i]) setImageOne(files[i] as File);
            }
        }
    }
};

const setImageOne = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
        const base64 = event.target?.result as string;
        editors.value?.commands.setImage({ src: base64 });
    };
    reader.readAsDataURL(file);
};
</script>
```

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `accept` | `string` | `image/png,image/jpeg,image/gif,image/webp,image/svg+xml` | HTML `accept` 语法，过滤选择器并校验类型 |
| `maxSize` | `number` | `10 * 1024 * 1024` | 单张图片大小上限（字节），超过弹错误提示并跳过 |
| `maxCount` | `number` | `Infinity` | 单次最多选择图片数量 |
| `imageLink` | `(url: string) => void` | — | "图片链接" 选项卡确认时的回调。是函数 → 走用户自定义；否则走默认 `setImage({ src })` |
| `customUpload` | `(files: File[] \| FileList) => void \| Promise<void>` | — | "上传图片" 选项卡确认时的回调。是函数 → 走用户自定义；否则文件转 base64 直接插入 |

导出类型：`Tev3DefaultConfig`、`Tev3UploadImageConfig`。

---

## 主题（明暗模式）

通过 `theme` prop 控制：

```vue
<TiptapEditorVue3 theme="system" />
<TiptapEditorVue3 theme="light" />
<TiptapEditorVue3 theme="dark" />
```

- `system`：自动跟随系统 `prefers-color-scheme`，系统切换会实时响应；
- `light` / `dark`：固定使用对应主题。

底层通过 `data-tev3-theme="light|dark"` 数据属性切换，所有颜色基于 CSS 变量。如需自定义品牌色，覆盖以下常用变量即可：

```css
.vue3-tiptap-editor[data-tev3-theme="light"] {
    --theme-color: #2080f0;
    --tev3-toolbar-bg: #fafbfc;
}

.vue3-tiptap-editor[data-tev3-theme="dark"] {
    --theme-color: #36ad6a;
    --tev3-editor-bg: #15161a;
}
```

JS 端可使用 `useTheme()` 自行实现切换：

```ts
import { ref } from "vue";
import { useTheme, type Tev3Theme } from "tiptap-editor-vue3";

const theme = ref<Tev3Theme>("system");
const { resolvedTheme } = useTheme(() => theme.value); // -> 'light' | 'dark'
```

---

## 国际化

内置 `zh-CN` / `en-US`，通过 `locale` prop 切换；任意时刻也可调用 `setLocale()` 全局切换。

```ts
import { setLocale, t } from "tiptap-editor-vue3";

setLocale("en-US");
console.log(t("toolbar.bold")); // "Bold"
```

```vue
<TiptapEditorVue3 locale="en-US" />
```

> 切换 `locale` 时工具栏、表格菜单、目录、占位符会自动刷新。

如需自定义文案，可在自己的项目中调用 `tev3I18n.global.mergeLocaleMessage('zh-CN', { ... })` 覆盖。

---

## 进阶：使用 Hooks 自行组装

若内置工具栏不满足需求，可直接复用 `useEditor` / `useEditorEvents` 自己组合 UI：

```vue
<template>
    <div>
        <button @click="editor?.chain().focus().toggleBold().run()">Bold</button>
        <TiptapEditorView :editor="editor" />
    </div>
</template>

<script setup lang="ts">
import {
    TiptapEditorView,
    useEditor,
    useEditorEvents,
    type EditorUpdatePayload
} from "tiptap-editor-vue3";
import StarterKit from "@tiptap/starter-kit";

const emit = defineEmits<{ (e: "update", p: EditorUpdatePayload): void }>();

const { editor, editable, toggleEditable } = useEditor({
    extensions: () => [StarterKit],
    content: () => "<p>Hello</p>",
    editable: () => true
});

useEditorEvents(editor, { emit });
</script>
```

`useEditor` 返回：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `editor` | `ShallowRef<Editor \| null>` | 实例（onMounted 后就绪） |
| `editable` | `Ref<boolean>` | 可编辑状态 |
| `rtl` | `Ref<boolean>` | RTL 排版 |
| `toggleEditable` | `() => void` | 切换只读 |
| `toggleRtl` | `() => void` | 切换 RTL |
| `create` / `destroy` | `() => void` | 手动控制生命周期 |

---

## 包导出

```ts
// 组件
export { TiptapEditorVue3, TiptapEditorView };

// Composables
export { useEditor, useEditorEvents, useTev3I18n };

// Props / 类型
export { editorProps };
export type {
    EditorProps,
    UseEditorOptions,
    UseEditorReturn,
    EditorUpdatePayload,
    EditorEventName,
    Tev3Locale
};

// 国际化
export { tev3I18n, t, setLocale, getLocale, installTev3I18n, SUPPORTED_LOCALES, zhCN, enUS };

// 主题
export { SUPPORTED_THEMES, DEFAULT_THEME, resolveTheme, useTheme };
export type { Tev3Theme, Tev3ResolvedTheme };

// Tiptap 常用 API（避免重复装包）
export { Editor, EditorContent, NodeViewWrapper, mergeAttributes };
export type { TiptapEditor, JSONContent, Content, AnyExtension };
```

---

## 开发命令

```bash
npm run dev           # 启动本地 playground
npm run build         # 构建组件库（dist/）
npm run build:demo    # 构建 playground 演示站（dist-demo/）
npm run preview:demo  # 本地预览演示站
npm run fmt           # 格式化（oxfmt）
npm run lint          # 代码检查（oxlint）
```

---

## 在线演示（GitHub Pages）

仓库已配置 `.github/workflows/deploy-pages.yml`，推送 `main` 分支后会自动构建并发布 `dist-demo`。

GitHub 仓库需在 `Settings → Pages → Source` 选择 **GitHub Actions**，演示地址：

**https://zekofront.github.io/tiptap-editor-vue3/**

---

## 参考链接

- [Tiptap 3 官方文档](https://tiptap.dev/docs)
- [ProseMirror Reference](https://prosemirror.net/docs/ref/)
- [Vue 3 + TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)

---

## License

[MIT](./LICENSE)
