import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        svgLoader({
            defaultImport: "component"
        }),
        dts({
            include: ["src"],
            insertTypesEntry: true,
            rollupTypes: false,
            exclude: ["main.ts"]
        }),
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
