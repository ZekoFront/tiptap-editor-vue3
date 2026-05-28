import { suggestion } from "@/components/emoji/suggestion";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";

const Emojis = Emoji.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {},
            emojis: gitHubEmojis,
            enableEmoticons: true,
            forceFallbackImages: false,
            enableSuggestion: true,
            bubble: true,
            suggestion: {}
        };
    }
});

Emojis.configure({
    suggestion: suggestion
});
export { Emojis };
