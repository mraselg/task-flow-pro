import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTasks, useTeamMembers, CATEGORY_LABELS, STATUS_LABELS } from "@/hooks/useSupabaseData";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: members = [] } = useTeamMembers();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const taskDates = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      if (!task.deadline) return;
      const d = task.deadline;
      if (!map[d]) map[d] = [];
      map[d].push(task);
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
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>;
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
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isSelected ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/50" :
                  isToday ? "bg-primary text-primary-foreground" :
                  hasTasks ? "bg-secondary/10 text-foreground hover:bg-secondary/20" :
                  "text-foreground hover:bg-muted"
                }`}
              >
                {day}
                {hasTasks && (
                  <div className="absolute bottom-0.5 flex gap-0.5">
                    {dateTasks.slice(0, 3).map((_, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? "bg-secondary-foreground/60" : "bg-secondary"}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks - Enhanced */}
      {selectedDate && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-secondary" />
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}
            </span>
          </div>
          {selectedTasks.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <CalendarDays className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tasks scheduled for this date</p>
            </div>
          ) : (
            selectedTasks.map(task => {
              const assignee = getMember(task.assigned_to);
              return (
                <div key={task.id} className="glass-card rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    {assignee && (
                      <Avatar className="w-9 h-9 mt-0.5 shrink-0">
                        <AvatarImage src={assignee.avatar_url || ""} alt={assignee.name} />
                        <AvatarFallback className="text-[10px] font-bold">{assignee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.priority === "high" ? "bg-destructive/15 text-destructive" :
                          task.priority === "medium" ? "bg-warning/15 text-warning" :
                          "bg-muted text-muted-foreground"
                        }`}>{task.priority.toUpperCase()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.status === "completed" ? "bg-success/15 text-success" :
                          task.status === "in_progress" ? "bg-warning/15 text-warning" :
                          "bg-info/15 text-info"
                        }`}>{STATUS_LABELS[task.status]}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignee?.name || "Unassigned"}
                        </span>
                        <span>{CATEGORY_LABELS[task.category]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
