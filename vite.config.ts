import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        svgLoader({
            defaultImport: "component"
        }),
        // 类型声明由 vue-tsc -p tsconfig.build.json 生成（见 package.json build 脚本）
        AutoImport({
            dts: "./src/typings/auto-imports.d.ts",
            imports: [
                "vue",
                {
                    "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
                }
            ],
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/ // .md
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve(__dirname, "src")
            }
        ]
    },
    base: "/tiptap-editor-vue3/",
    build: {
        minify: true,
        rolldownOptions: {
            external: ["vue"],
            output: {
                exports: "named",
                codeSplitting: true,
                assetFileNames: chunkInfo => {
                    return chunkInfo.names.some(e => e.endsWith(".css"))
                        ? "css/style.css"
                        : "assets/[name]-[hash][extname]";
                },
                globals: {
                    vue: "vue"
                }
            }
        },
        lib: {
            entry: "src/index.ts",
            name: "TiptapEditorVue3",
            // 输出文件名 (xm-common-ui.js, xm-common-ui.umd.js)
            fileName: format => `tiptap-editor-vue3.${format}.js`
        }
    }
});
