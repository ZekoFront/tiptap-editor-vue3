export default {
    editor: {
        placeholder: "Start typing..."
    },
    toolbar: {
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strike: "Strikethrough",
        highlight: "Highlight",
        color: "Text color",
        backgroundColor: "Background color",
        heading: "Heading",
        textAlign: "Text alignment",
        lineHeight: "Line height",
        code: "Inline code",
        codeBlock: "Code block",
        subscript: "Subscript",
        superscript: "Superscript",
        orderedList: "Ordered list",
        bulletList: "Bullet list",
        blockquote: "Quote",
        horizontalRule: "Horizontal rule",
        link: "Link",
        image: "Insert image",
        table: "Table",
        emoji: "Emoji",
        taskList: "Task list",
        clear: "Clear document",
        undo: "Undo",
        redo: "Redo",
        contents: "Outline",
        exportDocx: "Export DOCX"
    },
    heading: {
        paragraph: "Paragraph",
        level: "Heading {n}"
    },
    contents: {
        title: "Document outline",
        empty: "No headings",
        untitled: "(Untitled)"
    },
    table: {
        operations: "Table actions",
        deleteTable: "Delete table",
        addColumnBefore: "Add column before",
        addColumnAfter: "Add column after",
        addRowBefore: "Add row before",
        addRowAfter: "Add row after",
        deleteColumn: "Delete column",
        deleteRow: "Delete row",
        mergeCells: "Merge cells",
        splitCell: "Split cell",
        headerColumn: "Header options",
        toggleHeaderColumn: "Toggle header column",
        toggleHeaderRow: "Toggle header row",
        toggleHeaderCell: "Toggle header cell"
    },
    image: {
        insert: "Insert image",
        linkPlaceholder: "Enter image URL",
        linkInvalid: "Invalid image URL. Please enter a valid address."
    },
    link: {
        placeholder: "Enter link URL"
    },
    textAlign: {
        left: "Align left",
        center: "Align center",
        right: "Align right",
        justify: "Justify"
    },
    clear: {
        title: "Warning",
        content: "Clear the entire document?",
        confirm: "Confirm",
        cancel: "Cancel"
    },
    tableNotice: {
        nestedNotSupported: "Nested tables are not supported"
    },
    common: {
        noTip: "No description"
    }
} as const;
