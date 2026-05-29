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
import type { Editor, EditorUpdatePayload } from "tiptap-editor-vue3";

const onReady = (editor: Editor) => console.log("ready", editor);
const onUpdate = ({ html, json }: EditorUpdatePayload) => console.log(html, json);
</script>
```

## Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
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
