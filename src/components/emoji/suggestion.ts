import { computePosition, type VirtualElement } from "@floating-ui/dom";
import { type SuggestionOptions } from "@tiptap/suggestion";
import { VueRenderer } from "@tiptap/vue-3";
import EmojiList from "./EmojiList.vue";

// 定义 Tiptap 内部存储的 Emoji 数据项接口
interface EmojiItem {
    name: string;
    emoji: string;
    shortcodes: string[];
    tags: string[];
}

// 导出带有精确类型的配置对象
export const suggestion: Omit<SuggestionOptions<EmojiItem>, "editor"> = {
    items: ({ editor, query }) => {
        // 从 Tiptap 的存储空间获取所有表情数据（需确保已安装并配置了 @tiptap/extension-emoji）
        const emojis = (editor.storage.emoji?.emojis as EmojiItem[]) || [];

        return emojis
            .filter(({ shortcodes, tags }) => {
                const lowerQuery = query.toLowerCase();
                return (
                    shortcodes.some(shortcode => shortcode.startsWith(lowerQuery)) ||
                    tags.some(tag => tag.startsWith(lowerQuery))
                );
            })
            .slice(0, 5);
    },

    render: () => {
        // 精准定义 VueRenderer 实例类型，避免使用 any
        let component: VueRenderer | null = null;

        function repositionComponent(clientRect: DOMRect | null) {
            if (!component || !component.element || !clientRect) {
                return;
            }

            // 构造符合 Floating UI 要求的虚拟元素对象
            const virtualElement: VirtualElement = {
                getBoundingClientRect() {
                    return clientRect;
                }
            };
            // @ts-ignore
            computePosition(virtualElement, component.element, {
                placement: "bottom-start"
            }).then(pos => {
                // 安全地将位置样式应用到 DOM 元素
                if (component?.element) {
                    // @ts-ignore
                    Object.assign(component.element.style, {
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        position: pos.strategy === "fixed" ? "fixed" : "absolute"
                    });
                }
            });
        }

        return {
            onStart: props => {
                component = new VueRenderer(EmojiList, {
                    props,
                    editor: props.editor
                });

                if (component.element) {
                    document.body.appendChild(component.element);
                }
                repositionComponent(props.clientRect ? props.clientRect() : null);
            },

            onUpdate(props) {
                if (component) {
                    component.updateProps(props);
                }
                repositionComponent(props.clientRect ? props.clientRect() : null);
            },

            onKeyDown(props) {
                if (!component) {
                    return false;
                }

                if (props.event.key === "Escape") {
                    if (component.element && document.body.contains(component.element)) {
                        document.body.removeChild(component.element);
                    }
                    component.destroy();
                    return true;
                }

                // 显式断言 ref 上的组件实例包含键盘事件处理函数
                const listInstance = component.ref as { onKeyDown?: (p: typeof props) => boolean } | null;
                return listInstance?.onKeyDown?.(props) ?? false;
            },

            onExit() {
                if (component) {
                    if (component.element && document.body.contains(component.element)) {
                        document.body.removeChild(component.element);
                    }
                    component.destroy();
                    component = null; // 释放内存
                }
            }
        };
    }
};
