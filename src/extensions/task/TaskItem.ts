import { TaskItem as TiptapTaskItem } from "@tiptap/extension-list";

/**
 * TaskItem 必须与 TaskList 一起注册，否则只会渲染成普通无序列表。
 * @see https://tiptap.dev/docs/editor/extensions/nodes/task-item
 * @see https://tiptap.dev/docs/editor/extensions/nodes/task-list
 */
const TaskItem = TiptapTaskItem.configure({
    nested: true,
    taskListTypeName: "taskList"
});

export { TaskItem };
