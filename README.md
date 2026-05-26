# tiptap-editor-vue3

> 基于 [Tiptap 3](https://tiptap.dev/) + Vue 3 + TypeScript + Vite 开发的高质量富文本编辑器组件库。

## 技术栈

- **框架**：Vue 3 (`<script setup>`) + TypeScript
- **编辑器内核**：Tiptap 3 / ProseMirror
- **构建工具**：Vite + vite-plugin-dts
- **UI 库**：Naive UI
- **样式**：SCSS（`sass-embedded`）
- **代码规范**：oxlint + oxfmt

---

## 项目目录结构

为保证库的可维护性和可扩展性，统一按以下结构开发，新增功能请放入对应目录，**不要在 `src/` 根目录随意添加文件**。

```text
tiptap-editor-vue3/
├── src/
│   ├── components/              # 编辑器内部子组件（工具栏、菜单、弹层等纯 UI）
│   │   ├── toolbar/             # 顶部工具栏 + 按钮分组
│   │   │   ├── Toolbar.vue
│   │   │   ├── ToolbarButton.vue
│   │   │   ├── ToolbarDivider.vue
│   │   │   └── groups/          # 按功能拆分的按钮组：text / list / table / ...
│   │   ├── bubble-menu/         # 选中文本气泡菜单
│   │   ├── floating-menu/       # 浮动 / Slash 菜单
│   │   ├── dialogs/             # 链接、图片、表格等弹窗
│   │   ├── color-picker/
│   │   ├── emoji-picker/
│   │   └── context-menu/        # 表格右键菜单等
│   │
│   ├── core/                    # 编辑器核心（与 editor 实例强相关，区别于纯 UI）
│   │   ├── Editor.vue           # 主组件（迁移自 src/text/editor.vue）
│   │   ├── EditorContent.vue    # 仅渲染内容区，便于「只读视图」复用
│   │   ├── useEditor.ts         # 创建 / 销毁 editor 实例的核心 hook
│   │   ├── useEditorEvents.ts   # 事件总线、emit 处理
│   │   └── editor-props.ts      # props / defaults / 校验 单独抽离
│   │
│   ├── extensions/              # 自定义 Tiptap 扩展（库对外导出）
│   │   ├── index.ts             # 统一聚合导出
│   │   ├── presets/             # 预设组合：full / minimal / starter
│   │   │   ├── full-kit.ts
│   │   │   └── minimal-kit.ts
│   │   ├── nodes/               # Node 类型扩展（image、video、mention、callout…）
│   │   │   ├── image-resizable/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ImageView.vue       # NodeViewWrapper
│   │   │   │   ├── plugin.ts           # ProseMirror Plugin 部分
│   │   │   │   └── types.ts
│   │   │   ├── video/
│   │   │   ├── attachment/
│   │   │   └── mention/
│   │   ├── marks/               # Mark 类型扩展（font-size、line-height…）
│   │   │   ├── font-size.ts
│   │   │   └── line-height.ts
│   │   ├── functionality/       # 行为类扩展（不渲染节点，仅改变行为）
│   │   │   ├── trailing-node.ts
│   │   │   ├── selection.ts
│   │   │   ├── markdown-shortcuts.ts
│   │   │   └── indent.ts
│   │   └── suggestion/          # 基于 @tiptap/suggestion 的功能（@提及、/ 命令）
│   │       ├── slash-command.ts
│   │       └── SlashList.vue
│   │
│   ├── composables/             # 通用组合式函数（替代旧的 hooks/ 目录）
│   │   ├── useDiscreteApi.ts
│   │   ├── useUploader.ts
│   │   ├── useHotkey.ts
│   │   ├── useClipboard.ts
│   │   └── useI18n.ts
│   │
│   ├── utils/                   # 纯函数工具（无 Vue / 无副作用）
│   │   ├── image.ts             # 库对外导出：图片处理
│   │   ├── dom.ts
│   │   ├── file.ts
│   │   ├── html.ts              # 用 dompurify 做 sanitize
│   │   └── docx.ts              # html-docx-js-typescript 导出
│   │
│   ├── styles/                  # 样式总入口（替代旧的 src/style.css）
│   │   ├── index.scss           # 总入口，构建后产出 dist/css/style.css
│   │   ├── variables.scss       # CSS 变量 / SCSS 变量（颜色、间距、字号）
│   │   ├── mixins.scss
│   │   ├── reset.scss
│   │   ├── themes/
│   │   │   ├── light.scss
│   │   │   └── dark.scss
│   │   ├── prosemirror.scss     # ProseMirror 选区 / 拖拽 / 光标等基础样式
│   │   ├── editor.scss          # 编辑器容器 & 排版（h1~h6、blockquote、table…）
│   │   ├── toolbar.scss
│   │   ├── extensions/          # 各扩展的样式（与 extensions/ 一一对应）
│   │   │   ├── image.scss
│   │   │   ├── code-block.scss
│   │   │   └── table.scss
│   │   └── components/          # 业务子组件样式
│   │
│   ├── locales/                 # 多语言（基于 vue-i18n）
│   │   ├── index.ts
│   │   ├── zh-CN.ts
│   │   └── en-US.ts
│   │
│   ├── assets/
│   │   └── icons/               # SVG 图标体系（保持现状）
│   │
│   ├── constants/               # 常量：默认配置、按钮 schema、键名
│   │   ├── default-config.ts
│   │   └── toolbar-schema.ts
│   │
│   ├── typings/                 # 公共类型定义
│   │   ├── index.ts             # 对外导出的业务类型
│   │   ├── editor.d.ts
│   │   ├── global.d.ts
│   │   ├── auto-imports.d.ts
│   │   └── components.d.ts
│   │
│   ├── index.ts                 # 库的真正入口（替代 src/text/editor.ts）
│   ├── install.ts               # Vue plugin install 函数
│   │
│   └── playground/              # 仅用于本地 dev 调试，不参与库打包
│       ├── App.vue
│       └── main.ts
│
├── dist/                        # 构建产物
├── docs/                        # VitePress 文档
├── examples/                    # 各种使用示例（CDN / Vite / Nuxt）
├── tests/                       # 单元测试 / e2e
├── vite.config.ts               # dev 用配置
├── vite.config.lib.ts           # 库构建专用配置
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

---

## 目录约定与开发规范

### 1. `extensions/` —— 按 Tiptap 概念分层

Tiptap 扩展只有三种：`Node` / `Mark` / `Extension(behavior)`，**不要按字母混在一起**。

| 子目录 | 用途 | 示例 |
| --- | --- | --- |
| `nodes/` | 渲染节点 | image、video、mention、callout |
| `marks/` | 行内格式 | font-size、line-height、letter-spacing |
| `functionality/` | 不渲染，只改行为 | trailing-node、indent、shortcuts |
| `suggestion/` | 基于 `@tiptap/suggestion` 的功能 | @提及、`/` 命令 |
| `presets/` | 预设组合，便于一行接入 | FullKit、MinimalKit |

预设组合用法示例：

```ts
import { Editor } from '@tiptap/vue-3'
import { FullKit } from 'tiptap-editor-vue3/extensions'

new Editor({ extensions: [FullKit] })
```

### 2. 复杂扩展使用「文件夹」组织

```text
extensions/nodes/image-resizable/
├── index.ts          # 扩展定义
├── ImageView.vue     # NodeViewWrapper 组件
├── plugin.ts         # ProseMirror Plugin 部分
└── types.ts
```

扩展自身样式必须 import 到 `styles/extensions/<name>.scss`，让用户**整体引一份 CSS** 即可获得所有样式。

### 3. `styles/` —— 集中管理，暴露 CSS 变量

- `styles/index.scss` 是唯一总入口，最终编译为 `dist/css/style.css`
- 不要在 `.vue` 的 `<style>` 中写主题相关样式，统一放到 `styles/`
- 对外暴露 **CSS 变量**（不是 SCSS 变量），让用户可在自己的应用里直接覆写：

```scss
:root {
  --tev3-primary: #646cff;
  --tev3-border: #e5e7eb;
  --tev3-toolbar-bg: #fff;
  --tev3-radius: 6px;
  --tev3-font-size: 14px;
}
```

业务样式中统一使用 `var(--tev3-xxx)`，便于换肤 / 暗色模式。

### 4. `core/` vs `components/` 的边界

| 目录 | 职责 | 是否依赖 editor 实例 |
| --- | --- | --- |
| `core/` | 编辑器实例容器、生命周期、事件 | ✅ 强依赖 |
| `components/` | 纯 UI 表现（按钮、菜单、弹窗） | ❌ 通过 props 传入 |

这样以后要单独发一个 `<EditorContent />` 只读视图、或更换 UI 主题都很简单。

### 5. 库入口与 dev 入口必须分离

- 库入口：`src/index.ts`，由 `vite.config.lib.ts` 构建
- dev 调试入口：`src/playground/main.ts`，由 `vite.config.ts` 启动
- `vite.config.lib.ts` 中 `build.rollupOptions.external` 必须排除 `vue`、`@tiptap/*`、`naive-ui` 等 peer 依赖

### 6. `src/index.ts` 导出规范

```ts
import install from './install'

export { install as default }

export { default as TiptapEditorVue3 } from './core/Editor.vue'

export * from './extensions'
export * from './utils/image'
export * from './utils/html'
export * from './composables'

export type * from './typings'
```

> ⚠️ 不建议直接 `export * from '@tiptap/vue-3'`，会让产物体积/类型膨胀。**只 re-export 必要的** `Editor` / `EditorContent` / `NodeViewWrapper` 等。

### 7. 命名约定

| 类型 | 命名风格 | 示例 |
| --- | --- | --- |
| Vue 组件 | PascalCase | `Toolbar.vue` |
| 扩展定义文件 | kebab-case | `font-size.ts` |
| Composable | `use` 前缀 + camelCase | `useEditor.ts` |
| 工具函数文件 | camelCase | `image.ts` |
| 类型 | PascalCase | `EditorProps` |
| CSS 类前缀 | 统一 `tev3-` 防冲突 | `tev3-toolbar`、`tev3-btn` |

### 8. 历史目录迁移对照表

| 旧路径 | 新路径 | 说明 |
| --- | --- | --- |
| `src/text/editor.vue` | `src/core/Editor.vue` | 主组件改名并迁移 |
| `src/text/editor.ts` | `src/index.ts` | 库入口 |
| `src/hooks/` | `src/composables/` | 与 Vue 3 生态命名对齐 |
| `src/style.css` | `src/styles/index.scss` | 样式集中化 |
| `src/App.vue`、`src/main.ts` | `src/playground/` | dev 入口与库代码隔离 |
| `src/components/HelloWorld.vue` | 删除 | Vite 模板残留 |

---

## 开发命令

```bash
pnpm dev          # 启动本地 playground
pnpm build        # 构建库（vue-tsc -b && vite build）
pnpm fmt          # 格式化
pnpm lint         # 代码检查
pnpm preview      # 预览构建结果
```

## 参考链接

- [Tiptap 3 官方文档](https://tiptap.dev/docs)
- [ProseMirror Reference](https://prosemirror.net/docs/ref/)
- [Vue 3 + TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)
