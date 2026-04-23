import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router";

// --- Mock Data ---
const initialTasks = [
  { id: "1", title: "Design System Updates", status: "todo", priority: "high", due: "Oct 24", comments: 3, attachments: 1, assignee: "https://i.pravatar.cc/150?u=1" },
  { id: "2", title: "API Integration Strategy", status: "todo", priority: "medium", due: "Oct 25", comments: 0, attachments: 0, assignee: "https://i.pravatar.cc/150?u=2" },
  { id: "3", title: "User Onboarding Flow", status: "in-progress", priority: "high", due: "Oct 22", comments: 5, attachments: 2, assignee: "https://i.pravatar.cc/150?u=3" },
  { id: "4", title: "Update Documentation", status: "done", priority: "low", due: "Oct 20", comments: 1, attachments: 0, assignee: "https://i.pravatar.cc/150?u=4" },
];

const ITEM_TYPE = "TASK";

// --- Components ---

const TaskCard = ({ task, index, moveTask }: { task: any, index: number, moveTask: (id: string, status: string) => void }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`bg-white dark:bg-[#1C1C1E] p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm cursor-grab active:cursor-grabbing mb-3 group hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm ${
          task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
          task.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400" :
          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
        }`}>
          {task.priority}
        </div>
        <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-sm font-medium mb-3 text-neutral-900 dark:text-white">{task.title}</h4>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> {task.comments}
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" /> {task.attachments}
            </div>
          )}
        </div>
        <img src={task.assignee} alt="Assignee" className="w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-800" />
      </div>
    </div>
  );
};

const Column = ({ title, status, tasks, moveTask }: { title: string, status: string, tasks: any[], moveTask: (id: string, status: string) => void }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={dropRef}
        className={`flex-1 rounded-xl p-2 min-h-[500px] transition-colors ${
          isOver ? "bg-neutral-100 dark:bg-neutral-800/50" : "bg-neutral-50 dark:bg-[#111113] border border-transparent dark:border-neutral-800/30"
        }`}
      >
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} moveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

export function ProjectDetailsPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("board");

  const moveTask = (id: string, newStatus: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shrink-0">
          <div className="flex items-center text-xs text-neutral-500 mb-4">
            <Link to="/app/projects" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Projects</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-neutral-900 dark:text-neutral-300">Website Redesign</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Website Redesign</h1>
              <span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs px-2 py-1 rounded-md font-medium">On Track</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 mr-2">
                {["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3"].map((src, i) => (
                  <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#161618] relative" style={{ zIndex: 3 - i }} />
                ))}
              </div>
              <button className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                Share
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {["Board", "List", "Timeline", "Activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 bg-neutral-50 dark:bg-[#0E0E11]">
          <div className="flex gap-6 h-full items-start">
            {columns.map((col) => (
              <Column
                key={col.id}
                title={col.title}
                status={col.id}
                tasks={tasks.filter((t) => t.status === col.id)}
                moveTask={moveTask}
              />
            ))}
            <div className="w-80 shrink-0">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Plus className="w-4 h-4" /> Add Column
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
