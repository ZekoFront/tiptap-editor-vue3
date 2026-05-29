# tiptap-editor-vue3

[![npm](https://img.shields.io/npm/v/tiptap-editor-vue3.svg)](https://www.npmjs.com/package/tiptap-editor-vue3)
[![license](https://img.shields.io/npm/l/tiptap-editor-vue3.svg)](./LICENSE)

> A high-quality rich text editor component library built on **[Tiptap 3](https://tiptap.dev/) + Vue 3 + TypeScript**.
>
> 基于 **Tiptap 3 + Vue 3 + TypeScript** 的高质量富文本编辑器组件库。

- Batteries included: toolbar, bubble menu, table context menu, outline sidebar
- Built-in **i18n** (zh-CN / en-US) and **theme** (light / dark / system)
- Full TypeScript types, tree-shakable, Hooks-friendly
- **Live demo**: https://zekofront.github.io/tiptap-editor-vue3/

## Features

**Text formatting** — Bold · Italic · Underline · Strike · Highlight · Text color · Background color · Subscript · Superscript · Inline code

**Blocks** — Heading (H1–H6) · Paragraph · Bullet list · Ordered list · Task list (checkable) · Blockquote · Horizontal rule · Code block (with syntax highlight via lowlight) · Image · Table · Link · Emoji (`:` trigger)

**Layout** — Text alignment (left / center / right / justify) · Line height · Drag handle (move blocks) · RTL support

**Editor UX** — Top toolbar · Selection bubble menu · Image bubble menu · Table context menu · Outline / table-of-contents sidebar · Placeholder · Character count limit · Undo / redo · Clear document · Export to **DOCX**

**Component-level** — Read-only view (`TiptapEditorView`) · `useEditor` / `useEditorEvents` Hooks for custom UI · Light / dark / system theme · Chinese / English i18n · Customizable bubble menu items · CSS variables for theming

## Installation

```bash
npm install tiptap-editor-vue3
```

> Requires **Vue 3** in your project (the only external dependency; all other deps are bundled).

## Usage

```ts
// main.ts
import { createApp } from "vue";
import TiptapEditorVue3 from "tiptap-editor-vue3";
import "tiptap-editor-vue3/dist/css/style.css";
import App from "./App.vue";

createApp(App).use(TiptapEditorVue3).mount("#app");
```

```vue
<template>
    <TiptapEditorVue3
        v-model="content"
        :is-editable="true"
        :character-count="20000"
        locale="zh-CN"
        theme="system"
        placeholder="Start typing..."
        @ready="onReady"
        @update="onUpdate"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor, EditorUpdatePayload } from "tiptap-editor-vue3";

const content = ref("<p>Hello world</p>");

const onReady = (editor: Editor) => console.log("ready", editor);
const onUpdate = ({ html, json }: EditorUpdatePayload) => console.log(html, json);
</script>
```

> Use `v-model` to two-way bind content. Pass an HTML string (default) or a Tiptap JSON object; toggle the format of `update:modelValue` via the `outputFormat` prop.

## Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `modelValue` (`v-model`) | `string \| JSONContent \| null` | `""` | Editor content. HTML string or Tiptap JSON |
| `outputFormat` | `'html' \| 'json'` | `'html'` | Format of the value emitted by `update:modelValue` |
| `defaultConfig` | `Record<string, any> \| null` | `null` | Extra options forwarded to the underlying `new Editor(...)` |
| `extensions` | `AnyExtension[]` | `[]` | Custom extensions; falls back to the built-in full set when empty |
| `isEditable` | `boolean` | `true` | Whether the editor is editable |
| `isShowToolbar` | `boolean` | `true` | Show the top toolbar |
| `isEnabledContent` | `boolean` | `true` | Render the content area (toolbar-only when `false`) |
| `characterCount` | `number \| string` | `10000` | Maximum character count; further input is blocked |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | UI locale (toolbar tooltips, table menus, placeholder, etc.) |
| `theme` | `'system' \| 'light' \| 'dark'` | `'system'` | Color theme; `system` follows OS `prefers-color-scheme` |
| `placeholder` | `string` | i18n default | Placeholder for empty document |
| `customDubbleMenus` | `IDubbleMenu[]` | `[]` | Custom buttons for the bubble menu |
| `editorWrapperClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the outermost wrapper |
| `editorToolkitClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the toolbar |
| `editorContentClass` | `string` | `'custom-tiptap-content'` | Class for the ProseMirror content container |
| `editorContentsNavClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the outline sidebar |

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `string \| JSONContent` | Content changed (`v-model` sync). HTML string by default, or JSON when `outputFormat="json"` |
| `ready` | `editor: Editor` | Editor instance is ready (Tiptap `create`) |
| `update` | `{ editor, html, json }` | Content changed; `html` / `json` are pre-computed |
| `selection-update` | `{ editor }` | Caret / selection changed |
| `transaction` | `{ editor, transaction }` | Any ProseMirror transaction |
| `focus` | `{ editor, event: FocusEvent }` | Editor gained focus |
| `blur` | `{ editor, event: FocusEvent }` | Editor lost focus |
| `before-create` | `{ editor }` | Before the instance is created |
| `content-error` | `{ editor, error }` | Failed to parse initial content |
| `destroy` | — | Instance destroyed |

`update` payload type:

```ts
import type { EditorUpdatePayload } from "tiptap-editor-vue3";

interface EditorUpdatePayload {
    editor: Editor;
    html: string;
    json: JSONContent;
}
```

## Image upload

Custom image uploading is configured through `defaultConfig.uploadImage`. The rule is simple:

- If `imageLink` / `customUpload` are **functions**, the modal hands the URL / files to your code and you call `editor.commands.setImage(...)` yourself.
- Otherwise the editor falls back to the built-in behaviour (URL → `setImage({ src })`, file → base64 → `setImage`).

`accept` / `maxSize` / `maxCount` always run first — invalid files are rejected with a localised toast before your callback is invoked, and clicking "Upload" with nothing selected shows a warning.

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

// Custom image upload — must follow this exact shape, otherwise the callbacks won't fire
const defaultConfig: Tev3DefaultConfig = {
    uploadImage: {
        accept: "image/png,image/jpeg,image/webp",
        maxSize: 5 * 1024 * 1024, // 5 MB per file
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

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `accept` | `string` | `image/png,image/jpeg,image/gif,image/webp,image/svg+xml` | HTML `accept` syntax; filters the file picker and validates types |
| `maxSize` | `number` | `10 * 1024 * 1024` | Max bytes per file. Oversized files are rejected with a toast |
| `maxCount` | `number` | `Infinity` | Max files per upload session |
| `imageLink` | `(url: string) => void` | — | Callback for the "Insert by URL" tab. Defined → custom path; otherwise default `setImage({ src })` |
| `customUpload` | `(files: File[] \| FileList) => void \| Promise<void>` | — | Callback for the "Upload" tab. Defined → custom path; otherwise files are inlined as base64 |

Exported types: `Tev3DefaultConfig`, `Tev3UploadImageConfig`.

## Theme & i18n

```vue
<TiptapEditorVue3 theme="dark" locale="en-US" />
```

- `theme`: `'system' | 'light' | 'dark'` — applied via `data-tev3-theme` on the wrapper, all colors driven by CSS variables (override `--theme-color`, `--tev3-editor-bg`, `--tev3-toolbar-bg`, etc.)
- `locale`: `'zh-CN' | 'en-US'` — toolbar / menus / placeholder switch reactively

```ts
import { setLocale, useTheme, type Tev3Theme } from "tiptap-editor-vue3";

setLocale("en-US");
const { resolvedTheme } = useTheme(() => "system"); // -> 'light' | 'dark'
```

## Documentation

Full documentation including theme customisation, Hooks-based composition (`useEditor` / `useEditorEvents`) and the public API surface:

- [English](https://github.com/ZekoFront/tiptap-editor-vue3/blob/main/README.en.md)
- [简体中文](https://github.com/ZekoFront/tiptap-editor-vue3/blob/main/README.zh-CN.md)

## License

[MIT](./LICENSE) © ZekoFront
