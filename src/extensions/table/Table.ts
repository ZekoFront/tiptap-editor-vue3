import TableIcon from "@/components/table/TableIcon.vue";
import { t } from "@/locales";
import type { ITableContextMenuItem } from "@/typings/index";
import { Editor } from "@tiptap/core";
import { Table as TiptapTable, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { h } from "vue";

function renderCustomHeader() {
    return h("div", { style: { fontWeight: "bold", textAlign: "center" } }, t("table.operations"));
}

const Table = TiptapTable.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            resizable: true,
            renderWrapper: true,
            handleWidth: 5,
            cellMinWidth: 25,
            lastColumnResizable: true,
            allowTableNodeSelection: false,
            View: null,
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                const menuOptions: ITableContextMenuItem[] = [
                    {
                        key: "header",
                        type: "render",
                        render: renderCustomHeader
                    },
                    {
                        key: "header-divider",
                        type: "divider"
                    },
                    {
                        label: t("table.deleteTable"),
                        key: "deleteTable",
                        command: function () {
                            editor.commands.deleteTable();
                        }
                    },
                    {
                        label: t("table.addColumnBefore"),
                        key: "addColumnBefore",
                        command: function () {
                            editor.commands.addColumnBefore();
                        }
                    },
                    {
                        label: t("table.addColumnAfter"),
                        key: "addColumnAfter",
                        command: function () {
                            editor.commands.addColumnAfter();
                        }
                    },
                    {
                        label: t("table.addRowBefore"),
                        key: "addRowBefore",
                        command: function () {
                            editor.commands.addRowBefore();
                        }
                    },
                    {
                        label: t("table.addRowAfter"),
                        key: "addRowBAfter",
                        command: function () {
                            editor.commands.addRowAfter();
                        }
                    },
                    {
                        key: "header-divider",
                        type: "divider"
                    },
                    {
                        label: t("table.deleteColumn"),
                        key: "deleteColumn",
                        command: function () {
                            editor.commands.deleteColumn();
                        }
                    },
                    {
                        label: t("table.deleteRow"),
                        key: "deleteRow",
                        command: function () {
                            editor.commands.deleteRow();
                        }
                    },
                    {
                        key: "header-divider",
                        type: "divider"
                    },
                    {
                        label: t("table.mergeCells"),
                        key: "mergeCells",
                        command: function () {
                            editor.commands.mergeCells();
                        }
                    },
                    {
                        label: t("table.splitCell"),
                        key: "splitCell",
                        command: function () {
                            editor.commands.splitCell();
                        }
                    },
                    {
                        key: "header-divider",
                        type: "divider"
                    },
                    {
                        label: t("table.headerColumn"),
                        key: "headerColumn",
                        children: [
                            {
                                label: t("table.toggleHeaderColumn"),
                                key: "toggleHeaderColumn",
                                command: function () {
                                    editor.commands.toggleHeaderColumn();
                                }
                            },
                            {
                                label: t("table.toggleHeaderRow"),
                                key: "toggleHeaderRow",
                                command: function () {
                                    editor.commands.toggleHeaderRow();
                                }
                            },
                            {
                                label: t("table.toggleHeaderCell"),
                                key: "toggleHeaderCell",
                                command: function () {
                                    editor.commands.toggleHeaderCell();
                                }
                            }
                        ]
                    }
                ];
                return {
                    component: TableIcon,
                    componentProps: {
                        options: menuOptions,
                        editor,
                        isReadonly: !editor.isEditable,
                        tipText: t("toolbar.table")
                    }
                };
            }
        };
    },

    addExtensions() {
        return [TableRow, TableHeader, TableCell];
    }
}).configure({
    resizable: true
});

export { Table };
