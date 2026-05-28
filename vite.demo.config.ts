import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

/** Playground 演示站构建（用于 GitHub Pages） */
export default defineConfig({
    plugins: [
        vue(),
        svgLoader({ defaultImport: "component" }),
        AutoImport({
            dts: "./src/typings/auto-imports.d.ts",
            imports: [
                "vue",
                {
                    "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
                }
            ],
            include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
    },
    // 项目 Pages 地址：https://zekofront.github.io/tiptap-editor-vue3/
    base: process.env.VITE_BASE_PATH || "/tiptap-editor-vue3/",
    build: {
        outDir: "dist-demo",
        emptyOutDir: true
    }
});
