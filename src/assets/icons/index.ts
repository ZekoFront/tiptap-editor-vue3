// import { type AsyncComponentLoader, defineAsyncComponent } from "vue";

// const components = import.meta.glob("./*.svg");

// export default function install(app: any) {
//     for (const [key, value] of Object.entries(components)) {
//         const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
//         app.component(name, defineAsyncComponent(value as AsyncComponentLoader));
//     }
// }
// console.log(components, 9888);
// export { default as EmojiIcon } from "./emoji-icon.svg";
// export { default as BackgroundColorIcon } from "./background-color-icon.svg";
// export { default as AddImageIcon } from "./add-image-icon.svg";
// export { default as TableIcon } from "./table-icon.svg";

const modules = import.meta.glob("./*.svg", {
    eager: true,
    import: "default"
});
export const Icons = Object.fromEntries(
    Object.entries(modules).map(([path, component]) => {
        const base = path.replace(/^\.\/(.+)\.svg$/, "$1"); // table-icon
        const name = base.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase()); // TableIcon
        return [name, component];
    })
);
