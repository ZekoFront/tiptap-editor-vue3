export default {
    editor: {
        placeholder: "请输入内容..."
    },
    toolbar: {
        bold: "加粗",
        italic: "斜体",
        underline: "下划线",
        strike: "删除线",
        highlight: "高亮",
        color: "字体颜色",
        backgroundColor: "字体背景色",
        heading: "设置标题",
        textAlign: "文本对齐方式",
        lineHeight: "行间距",
        code: "行内代码",
        codeBlock: "代码块",
        subscript: "下标",
        superscript: "上标",
        orderedList: "有序列表",
        bulletList: "无序列表",
        blockquote: "引用",
        horizontalRule: "水平分隔符",
        link: "超链接",
        image: "添加图片",
        table: "表格",
        emoji: "表情",
        taskList: "任务列表",
        clear: "清空文档",
        undo: "撤销",
        redo: "重做",
        contents: "目录",
        exportDocx: "导出 DOCX",
        importAttachment: "导入附件",
        importWord: "导入word文件",
        importTxt: "导入txt文件"
    },
    heading: {
        paragraph: "正文",
        level: "H{n} 标题 {n}"
    },
    contents: {
        title: "文档目录",
        empty: "暂无标题",
        untitled: "（无标题）"
    },
    table: {
        operations: "操作表格",
        deleteTable: "删除表格",
        addColumnBefore: "向前添加列",
        addColumnAfter: "向后添加列",
        addRowBefore: "向前添加行",
        addRowAfter: "向后添加行",
        deleteColumn: "删除列",
        deleteRow: "删除行",
        mergeCells: "合并单元格",
        splitCell: "拆分单元格",
        headerColumn: "表格头标题",
        toggleHeaderColumn: "设置列标题",
        toggleHeaderRow: "设置行标题",
        toggleHeaderCell: "设置单元格标题"
    },
    image: {
        insert: "插入图片",
        linkPlaceholder: "请输入图片链接",
        linkInvalid: "图片地址格式错误，请重新输入正确图片地址",
        modalTitle: "上传图片",
        tabUpload: "上传图片",
        tabLink: "图片链接",
        confirm: "立即上传",
        cancel: "取消",
        empty: "请先选择要上传的图片",
        delete: "删除图片",
        chooseFile: "选择文件",
        fileTypeError: "不支持的文件类型：{name}（仅支持 {accept}）",
        fileSizeError: "图片不能超过 {size}MB：{name}",
        fileCountError: "最多只能选择 {count} 张图片",
        uploadFailed: "图片上传失败"
    },
    link: {
        placeholder: "请输入链接"
    },
    textAlign: {
        left: "左对齐",
        center: "居中对齐",
        right: "右对齐",
        justify: "两端对齐"
    },
    clear: {
        title: "警告",
        content: "你确定要清空全部文档内容吗？",
        confirm: "确定",
        cancel: "取消"
    },
    tableNotice: {
        nestedNotSupported: "表格暂时不支持嵌套"
    },
    common: {
        noTip: "暂无提示",
        importSuccess: "导入文件内容成功",
        importError: "导入失败: ",
        importFormatError: "格式错误",
        fileReadError: "文件读取发生错误"
    }
} as const;