# tiptap-editor-vue3

[简体中文](./README.zh-CN.md) | English

> A high-quality rich text editor component library built on [Tiptap 3](https://tiptap.dev/) + Vue 3 + TypeScript + Vite.

- Batteries included: toolbar, bubble menu, table context menu, outline sidebar, floatable image selection
- Built-in i18n (Chinese / English, powered by vue-i18n)
- Light / dark / follow-system theme, fully customisable via CSS variables
- Full TypeScript types, supports tree-shaking and Hooks-based composition
- Live demo: **https://zekofront.github.io/tiptap-editor-vue3/**

---

## Features

| Category | Items |
| -------- | ----- |
| **Text marks** | Bold, Italic, Underline, Strike, Highlight, Text color, Background color, Subscript, Superscript, Inline code |
| **Block nodes** | Heading H1–H6, Paragraph, Bullet list, Ordered list, **Task list** (checkable), Blockquote, Horizontal rule, **Code block** (lowlight syntax highlight), Image, Table, Link, **Emoji** (`:` trigger) |
| **Layout & behaviour** | Text alignment (left / center / right / justify), Line height, Drag handle (move blocks), RTL support |
| **Editor UX** | Top toolbar, Selection bubble menu, Image bubble menu, Table context menu, Outline / table-of-contents sidebar, Placeholder, Character count limit, Undo / redo, Clear document, Export to **DOCX** |
| **Component-level** | Read-only view (`TiptapEditorView`), `useEditor` / `useEditorEvents` Hooks, Light / dark / system theme, zh-CN / en-US i18n, Customizable bubble menu items, CSS variables for theming |

---

## Installation

```bash
npm install tiptap-editor-vue3
# or
pnpm add tiptap-editor-vue3
# or
yarn add tiptap-editor-vue3
```

> Requires **Vue 3** in your project (the only external dependency; all other deps — Tiptap, naive-ui, vue-i18n, etc. — are bundled into the dist).

---

## Quick Start

### Option 1: Install as a plugin (recommended)

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
        locale="en-US"
        placeholder="Start typing..."
        @ready="onReady"
        @update="onUpdate"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor, EditorUpdatePayload } from "tiptap-editor-vue3";

const content = ref("<p>Initial content</p>");

const onReady = (editor: Editor) => {
    console.log("editor ready", editor);
};

const onUpdate = ({ html, json }: EditorUpdatePayload) => {
    console.log(html, json);
};
</script>
```

> Use `v-model` to two-way bind content. Pass an HTML string (default) or a Tiptap JSON object; toggle the format emitted by `update:modelValue` via the `outputFormat` prop.

### Option 2: On-demand import

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

### Read-only view

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
| `placeholder` | `string` | i18n default | Placeholder for empty document; falls back to the current locale |
| `customDubbleMenus` | `IDubbleMenu[]` | `[]` | Custom buttons for the bubble menu |
| `editorWrapperClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the outermost wrapper |
| `editorToolkitClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the toolbar |
| `editorContentClass` | `string` | `'custom-tiptap-content'` | Class for the ProseMirror content container |
| `editorContentsNavClass` | `string \| any[] \| Record<string, any>` | `undefined` | Class for the outline sidebar |

> Types like `IDubbleMenu` are exported from the package: `import type { IDubbleMenu, EditorProps } from "tiptap-editor-vue3"`.

---

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `string \| JSONContent` | Content changed (`v-model` sync). HTML string by default, or JSON when `outputFormat="json"` |
| `ready` | `editor: Editor` | Fired once the editor instance is ready (equivalent to Tiptap's `create`) |
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

---

## Image upload

All image-upload customisation lives under `defaultConfig.uploadImage`. The rule is simple:

- If `imageLink` / `customUpload` are **functions**, the modal hands the URL / files to your code and you call `editor.commands.setImage(...)` yourself.
- Otherwise the editor falls back to its built-in behaviour (URL → `setImage({ src })`, file → base64 → `setImage`).

`accept` / `maxSize` / `maxCount` always run first — invalid files are rejected with a localised toast before your callback is invoked, and clicking "Upload" with nothing selected shows a warning.

> Custom image upload — **the structure below must be respected exactly, otherwise the callbacks won't fire**:

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
| `imageLink` | `(url: string) => void` | — | "Insert by URL" callback. Defined → custom path; otherwise default `setImage({ src })` |
| `customUpload` | `(files: File[] \| FileList) => void \| Promise<void>` | — | "Upload" callback. Defined → custom path; otherwise files are inlined as base64 |

Exported types: `Tev3DefaultConfig`, `Tev3UploadImageConfig`.

---

## Theme (light / dark)

Controlled by the `theme` prop:

```vue
<TiptapEditorVue3 theme="system" />
<TiptapEditorVue3 theme="light" />
<TiptapEditorVue3 theme="dark" />
```

- `system`: follows the OS `prefers-color-scheme` and reacts in real time;
- `light` / `dark`: pinned to that theme.

Internally a `data-tev3-theme="light|dark"` attribute is applied to the wrapper and all colors are driven by CSS variables. To customise the palette, override variables in your stylesheet:

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

You can also drive themes programmatically with `useTheme()`:

```ts
import { ref } from "vue";
import { useTheme, type Tev3Theme } from "tiptap-editor-vue3";

const theme = ref<Tev3Theme>("system");
const { resolvedTheme } = useTheme(() => theme.value); // -> 'light' | 'dark'
```

---

## Internationalization

Built-in `zh-CN` / `en-US` messages. Switch via the `locale` prop, or call `setLocale()` programmatically.

```ts
import { setLocale, t } from "tiptap-editor-vue3";

setLocale("en-US");
console.log(t("toolbar.bold")); // "Bold"
```

```vue
<TiptapEditorVue3 locale="en-US" />
```

> The toolbar, table menus, outline sidebar and placeholder refresh automatically when `locale` changes.

To override or extend messages, call `tev3I18n.global.mergeLocaleMessage('en-US', { ... })` from your app.

---

## Advanced: Compose with Hooks

If the built-in toolbar does not fit your needs, build your own UI on top of `useEditor` / `useEditorEvents`:

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

`useEditor` returns:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `editor` | `ShallowRef<Editor \| null>` | Instance (ready after `onMounted`) |
| `editable` | `Ref<boolean>` | Editable state |
| `rtl` | `Ref<boolean>` | RTL layout flag |
| `toggleEditable` | `() => void` | Toggle editable state |
| `toggleRtl` | `() => void` | Toggle RTL |
| `create` / `destroy` | `() => void` | Manual lifecycle control |

---

## Public API

```ts
// Components
export { TiptapEditorVue3, TiptapEditorView };

// Composables
export { useEditor, useEditorEvents, useTev3I18n };

// Props / Types
export { editorProps };
export type {
    EditorProps,
    UseEditorOptions,
    UseEditorReturn,
    EditorUpdatePayload,
    EditorEventName,
    Tev3Locale
};

// i18n
export { tev3I18n, t, setLocale, getLocale, installTev3I18n, SUPPORTED_LOCALES, zhCN, enUS };

// Theme
export { SUPPORTED_THEMES, DEFAULT_THEME, resolveTheme, useTheme };
export type { Tev3Theme, Tev3ResolvedTheme };

// Re-exported Tiptap APIs (avoid double installs)
export { Editor, EditorContent, NodeViewWrapper, mergeAttributes };
export type { TiptapEditor, JSONContent, Content, AnyExtension };
```

---

## Scripts

```bash
npm run dev           # Start the local playground
npm run build         # Build the component library (dist/)
npm run build:demo    # Build the playground demo site (dist-demo/)
npm run preview:demo  # Preview the demo build locally
npm run fmt           # Format (oxfmt)
npm run lint          # Lint (oxlint)
```

---

## Live Demo (GitHub Pages)

`.github/workflows/deploy-pages.yml` automatically builds and publishes `dist-demo` after every push to `main`.

In the GitHub repository, set `Settings → Pages → Source` to **GitHub Actions**. Demo URL:

**https://zekofront.github.io/tiptap-editor-vue3/**

---

## References

- [Tiptap 3 Documentation](https://tiptap.dev/docs)
- [ProseMirror Reference](https://prosemirror.net/docs/ref/)
- [Vue 3 + TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)

---

## License

[MIT](./LICENSE)
