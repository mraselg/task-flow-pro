import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import TaskDetailModal from "@/components/TaskDetailModal";
import { useTasks, useTeamMembers, CATEGORY_LABELS, STATUS_LABELS } from "@/hooks/useSupabaseData";
import type { DbTask } from "@/hooks/useSupabaseData";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<DbTask | null>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: members = [] } = useTeamMembers();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const taskDates = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      if (!task.deadline) return;
      if (!map[task.deadline]) map[task.deadline] = [];
      map[task.deadline].push(task);
    });
    return map;
  }, [tasks]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const todayStr = new Date().toISOString().split("T")[0];
  const selectedTasks = selectedDate ? (taskDates[selectedDate] || []) : [];
  const getMember = (id: string | null) => members.find(m => m.id === id);

  if (tasksLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">View deadlines and scheduled tasks</p>
      </div>

      <div className="glass-card rounded-xl p-4 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-display font-bold text-lg text-foreground">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map(i => <div key={`b-${i}`} />)}
          {days.map(day => {
            const dateStr = formatDateStr(day);
            const dateTasks = taskDates[dateStr] || [];
            const hasTasks = dateTasks.length > 0;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isSelected ? "bg-accent text-accent-foreground ring-2 ring-accent/50" :
                  isToday ? "bg-primary text-primary-foreground" :
                  hasTasks ? "bg-accent/10 text-foreground hover:bg-accent/20" :
                  "text-foreground hover:bg-muted"
                }`}
              >
                {day}
                {hasTasks && (
                  <div className="absolute bottom-0.5 flex gap-0.5">
                    {dateTasks.slice(0, 3).map((_, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? "bg-accent-foreground/60" : "bg-accent"}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Popup Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => { if (!open) setSelectedDate(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-accent" />
              {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No tasks scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map(task => {
                const assignee = getMember(task.assigned_to);
                return (
                  <button
                    key={task.id}
                    onClick={() => { setSelectedDate(null); setSelectedTask(task); }}
                    className="w-full text-left rounded-xl border border-border bg-muted/30 p-4 hover:bg-muted/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {assignee && (
                        <Avatar className="w-9 h-9 mt-0.5 shrink-0 rounded-lg">
                          <AvatarImage src={assignee.avatar_url || ""} alt={assignee.name} />
                          <AvatarFallback className="rounded-lg text-[10px] font-bold">{assignee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${
                            task.priority === "high" ? "border-destructive/30 text-destructive bg-destructive/10" :
                            task.priority === "medium" ? "border-warning/30 text-warning bg-warning/10" :
                            "border-border text-muted-foreground"
                          }`}>{task.priority.toUpperCase()}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${
                            task.status === "completed" ? "border-success/30 text-success bg-success/10" :
                            task.status === "in_progress" ? "border-warning/30 text-warning bg-warning/10" :
                            "border-info/30 text-info bg-info/10"
                          }`}>{STATUS_LABELS[task.status]}</Badge>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {assignee?.name || "Unassigned"}
                          </span>
                          <span>{CATEGORY_LABELS[task.category]}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Detail Bottom Sheet */}
      <TaskDetailModal task={selectedTask} members={members} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default CalendarPage;
