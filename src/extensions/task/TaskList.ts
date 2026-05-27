import TaskIcon from "@/components/task/TaskIcon.vue";
import { TaskList as TiptapTaskList } from "@tiptap/extension-list";
import type { Editor } from "@tiptap/vue-3";

const TaskList = TiptapTaskList.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            itemTypeName: "taskItem",
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                return {
                    component: TaskIcon,
                    componentProps: {
                        editor,
                        isActive: editor.isActive("taskList"),
                        isReadonly: !editor.isEditable,
                        tipText: "任务列表",
                        command: () => {
                            editor.chain().focus().toggleTaskList().run();
                        }
                    }
                };
            }
        };
    }
});

export { TaskList };
