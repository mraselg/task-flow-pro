import { useState, useMemo } from "react";
import { MOCK_TASKS, MOCK_MEMBERS, CATEGORY_LABELS, type TaskStatus, type TaskCategory, type Task } from "@/lib/data";
import { Clock, CalendarDays, User, ChevronRight, Search, Filter, X } from "lucide-react";
import TaskDetailModal from "@/components/TaskDetailModal";

const TABS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-info text-info" },
  { id: "in_progress", label: "In Progress", color: "bg-warning text-warning" },
  { id: "completed", label: "Completed", color: "bg-success text-success" },
];

interface TasksPageProps {
  searchQuery?: string;
}

const TasksPage = ({ searchQuery = "" }: TasksPageProps) => {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("todo");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const effectiveSearch = searchQuery || localSearch;

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter(t => {
      if (t.status !== activeStatus) return false;
      if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
      if (selectedPriority !== "all" && t.priority !== selectedPriority) return false;
      if (effectiveSearch) {
        const q = effectiveSearch.toLowerCase();
        const member = MOCK_MEMBERS.find(m => m.id === t.assignedTo);
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          member?.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeStatus, selectedCategory, selectedPriority, effectiveSearch]);

  const activeFilters = (selectedCategory !== "all" ? 1 : 0) + (selectedPriority !== "all" ? 1 : 0);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and track all tasks</p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search in tasks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {localSearch && (
            <button onClick={() => setLocalSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
            showFilters || activeFilters > 0
              ? "bg-secondary/10 text-secondary border-secondary/30"
              : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
          {activeFilters > 0 && (
            <span className="w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card rounded-xl p-4 mb-4 animate-fade-in">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === "all" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                  }`}
                >All</button>
                {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                    }`}
                  >{CATEGORY_LABELS[cat]}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Priority</label>
              <div className="flex gap-1.5">
                {["all", "high", "medium", "low"].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                      selectedPriority === p ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                    }`}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedPriority("all"); }}
              className="mt-3 text-xs text-destructive font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

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
            <p className="text-muted-foreground text-sm">
              {effectiveSearch ? `No tasks matching "${effectiveSearch}"` : "No tasks in this category"}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const member = MOCK_MEMBERS.find(m => m.id === task.assignedTo);
            const daysLeft = Math.ceil((new Date(task.deadline).getTime() - new Date("2026-03-21").getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="glass-card rounded-xl p-4 lg:p-5 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
                      {task.status !== 'completed' && daysLeft <= 3 && daysLeft >= 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-destructive/15 text-destructive">
                          ⚠ {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{member?.name}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{task.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-secondary transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default TasksPage;
