import { Icons } from "@/assets/icons";
import EmojiIcon from "@/components/emoji/EmojiIcon.vue";
import { suggestion as emojiSuggestion } from "@/components/emoji/suggestion";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import type { Editor } from "@tiptap/vue-3";

/**
 * 必须与官方默认 suggestion 合并，不能只传 render/items。
 * 否则丢失 char: ':'、command、allow、pluginKey，输入 :man 不会出现提示框。
 * @see https://tiptap.dev/docs/editor/extensions/nodes/emoji
 */
// const Emojis = Emoji.extend({
//     addOptions() {
//         const parent = this.parent?.();

//         return {
//             ...parent,
//             HTMLAttributes: {},
//             emojis: gitHubEmojis,
//             enableEmoticons: true,
//             forceFallbackImages: false,
//             suggestion: {
//                 ...parent?.suggestion,
//                 ...emojiSuggestion
//             }
//         };
//     }
// });

const Emojis = Emoji.extend({
    addOptions() {
        const parent = this.parent?.();

        return {
            ...parent,
            HTMLAttributes: {},
            emojis: gitHubEmojis,
            enableEmoticons: true,
            forceFallbackImages: false,
            suggestion: {
                ...parent?.suggestion,
                ...emojiSuggestion
            },
            bubble: true,
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: EmojiIcon,
                    componentProps: {
                        isActive: editor.isActive("emoji"),
                        isReadonly: !editor.isEditable,
                        icons: Icons.EmojiIcon,
                        tipText: "表情",
                        editor: editor,
                        command: () => {
                            // editor.commands.toggleBold()
                        }
                    }
                };
            }
        };
    }
});

export { Emojis };
