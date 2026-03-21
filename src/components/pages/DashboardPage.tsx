import { MOCK_TASKS, MOCK_MEMBERS, STATUS_LABELS, CATEGORY_LABELS, type TaskStatus, type TaskCategory } from "@/lib/data";
import { ListTodo, Clock, CheckCircle2, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const todoCount = MOCK_TASKS.filter(t => t.status === 'todo').length;
  const progressCount = MOCK_TASKS.filter(t => t.status === 'in_progress').length;
  const completedCount = MOCK_TASKS.filter(t => t.status === 'completed').length;
  const totalCount = MOCK_TASKS.length;

  const stats = [
    { label: "Total Tasks", value: totalCount, icon: TrendingUp, color: "bg-primary text-primary-foreground" },
    { label: "To Do", value: todoCount, icon: ListTodo, color: "bg-info text-info-foreground" },
    { label: "In Progress", value: progressCount, icon: Clock, color: "bg-warning text-warning-foreground" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-success text-success-foreground" },
  ];

  const recentTasks = MOCK_TASKS.slice(0, 5);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Rasel! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-5 mb-8">
        <h3 className="font-display font-semibold text-foreground mb-4">Overall Progress</h3>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
          <div className="h-full bg-success transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
          <div className="h-full bg-warning transition-all" style={{ width: `${(progressCount / totalCount) * 100}%` }} />
          <div className="h-full bg-info transition-all" style={{ width: `${(todoCount / totalCount) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Completed ({completedCount})</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> In Progress ({progressCount})</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-info" /> To Do ({todoCount})</span>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {recentTasks.map((task) => {
            const member = MOCK_MEMBERS.find(m => m.id === task.assignedTo);
            return (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{member?.name} · {CATEGORY_LABELS[task.category]}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ml-3 ${
                  task.status === 'completed' ? 'bg-success/15 text-success' :
                  task.status === 'in_progress' ? 'bg-warning/15 text-warning' :
                  'bg-info/15 text-info'
                }`}>
                  {STATUS_LABELS[task.status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
