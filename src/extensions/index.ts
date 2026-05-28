import { Code } from "./code/Code";
import { CodeBlockLowlight } from "./code/CodeBlockLowlight";
import { Emojis } from "./emoji/Emoji";
import { Image } from "./image/Image";
import { Link } from "./link/Link";
import { BulletList } from "./list/BulletList";
import { OrderedList } from "./list/OrderedList";
import { Bold } from "./marks/Bold";
import { Color } from "./marks/Color";
import { Highlight } from "./marks/Highlight";
import { Italic } from "./marks/Italic";
import { Strike } from "./marks/Strike";
import { Subscript } from "./marks/Subscript";
import { Superscript } from "./marks/Superscript";
import { TextAlignment } from "./marks/TextAlignment";
import { Underline } from "./marks/Underline";
import { Table } from "./table/Table";
import { TaskItem } from "./task/TaskItem";
import { TaskList } from "./task/TaskList";
import { Heading } from "./title/Heading";
import { BackgroundColor } from "./utils/BackgroundColor";
import { Blockquote } from "./utils/Blockquote";
import { Clear } from "./utils/Clear";
import { History } from "./utils/History";
import { HorizontalRule } from "./utils/HorizontalRule";
import { LineHeight } from "./utils/LineHeight";

export const extensionsArray = [
    History,
    Bold,
    Italic,
    Strike,
    Underline,
    Highlight,
    Color,
    BackgroundColor,
    Heading,
    TextAlignment,
    LineHeight,
    Code,
    CodeBlockLowlight,
    Subscript,
    Superscript,
    OrderedList,
    BulletList,
    HorizontalRule,
    Blockquote,
    Table,
    Link,
    Image,
    TaskList,
    TaskItem,
    Emojis,
    Clear
];

export * from "./utils/Clear";
export * from "./utils/History";
export * from "./utils/BackgroundColor";
export * from "./image/Image";
export * from "./utils/LineHeight";
export * from "./title/Heading";
export * from "./marks/Bold";
export * from "./marks/Italic";
export * from "./marks/Strike";
export * from "./marks/Underline";
export * from "./code/Code";
export * from "./code/CodeBlock";
export * from "./marks/Subscript";
export * from "./marks/Superscript";
export * from "./list/OrderedList";
export * from "./list/BulletList";
export * from "./utils/HorizontalRule";
export * from "./utils/Blockquote";
export * from "./marks/Highlight";
export * from "./marks/Color";
export * from "./code/CodeBlockLowlight";
export * from "./table/Table";
export * from "./link/Link";
export * from "./marks/TextAlignment";
export * from "./task/TaskList";
export * from "./task/TaskItem";
export * from "./emoji/Emoji";
