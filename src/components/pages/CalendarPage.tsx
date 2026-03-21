import { useState, useMemo } from "react";
import { MOCK_TASKS } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 21)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const taskDates = useMemo(() => {
    const map: Record<string, typeof MOCK_TASKS> = {};
    MOCK_TASKS.forEach(task => {
      const d = task.deadline;
      if (!map[d]) map[d] = [];
      map[d].push(task);
    });
    return map;
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const today = "2026-03-21";

  const selectedTasks = selectedDate ? (taskDates[selectedDate] || []) : [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">View deadlines and scheduled tasks</p>
      </div>

      <div className="glass-card rounded-xl p-4 lg:p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-display font-bold text-lg text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(i => <div key={`b-${i}`} />)}
          {days.map(day => {
            const dateStr = formatDateStr(day);
            const hasTasks = !!taskDates[dateStr];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-secondary text-secondary-foreground"
                    : isToday
                    ? "bg-primary text-primary-foreground"
                    : hasTasks
                    ? "bg-secondary/10 text-foreground hover:bg-secondary/20"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {day}
                {hasTasks && !isSelected && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-secondary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <div className="mt-4 space-y-2 animate-slide-up">
          <h3 className="font-display font-semibold text-foreground text-sm px-1">
            Tasks for {selectedDate}
          </h3>
          {selectedTasks.length === 0 ? (
            <div className="glass-card rounded-xl p-4 text-center text-sm text-muted-foreground">
              No tasks scheduled for this date
            </div>
          ) : (
            selectedTasks.map(task => (
              <div key={task.id} className="glass-card rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                  task.status === 'completed' ? 'bg-success/15 text-success' :
                  task.status === 'in_progress' ? 'bg-warning/15 text-warning' :
                  'bg-info/15 text-info'
                }`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
