import { t } from "@/locales";
import { Editor } from "@tiptap/core";
import { v4 as uuidV4 } from "uuid";

export function getHeadingLevels() {
    const arr: { label: string; value: string; disabled: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
        if (i === 6) {
            arr.push({ label: t("heading.paragraph"), value: `${i + 1}`, disabled: false });
        } else {
            const num = i + 1;
            arr.push({ label: t("heading.level", { n: num }), value: `${num}`, disabled: false });
        }
    }
    return arr;
}

/** @deprecated 请使用 getHeadingLevels()，以便随 locale 更新 */
export const headerData = getHeadingLevels();

/**
 * 遍历 Tiptap 文档树，给没有 ID 的标题节点添加 ID
 */
export const ensureHeadingIds = (editor: Editor) => {
    const { doc, tr } = editor.state;
    const headingsToUpdate: { pos: number; id: string }[] = [];

    doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
            if (!node.attrs.id) {
                headingsToUpdate.push({
                    pos,
                    id: `H${node.attrs.level}_${uuidV4()}`
                });
            }
        }
    });

    if (headingsToUpdate.length > 0) {
        headingsToUpdate.forEach(({ pos, id }) => {
            tr.setNodeMarkup(pos, undefined, {
                ...doc.nodeAt(pos)?.attrs,
                id
            });
        });

        editor.view.dispatch(tr);
        return true;
    }

    return false;
};
