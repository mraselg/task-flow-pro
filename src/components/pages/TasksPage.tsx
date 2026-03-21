import { useState } from "react";
import { MOCK_TASKS, MOCK_MEMBERS, CATEGORY_LABELS, type TaskStatus } from "@/lib/data";
import { Clock, CalendarDays, User, ChevronRight } from "lucide-react";

const TABS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-info text-info" },
  { id: "in_progress", label: "In Progress", color: "bg-warning text-warning" },
  { id: "completed", label: "Completed", color: "bg-success text-success" },
];

const TasksPage = () => {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("todo");
  const filteredTasks = MOCK_TASKS.filter(t => t.status === activeStatus);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and track all tasks</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const count = MOCK_TASKS.filter(t => t.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeStatus === tab.id
                  ? `${tab.color.split(' ')[0]}/15 ${tab.color.split(' ')[1]} border border-current/20`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeStatus === tab.id ? `${tab.color.split(' ')[0]}/25` : "bg-background"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No tasks in this category</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const member = MOCK_MEMBERS.find(m => m.id === task.assignedTo);
            return (
              <div key={task.id} className="glass-card rounded-xl p-4 lg:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-destructive/15 text-destructive' :
                        task.priority === 'medium' ? 'bg-warning/15 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted">
                        {CATEGORY_LABELS[task.category]}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{member?.name}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{task.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TasksPage;
