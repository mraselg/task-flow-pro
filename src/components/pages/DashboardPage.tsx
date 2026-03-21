import { MOCK_TASKS, MOCK_MEMBERS, STATUS_LABELS, CATEGORY_LABELS, type TaskStatus, type TaskCategory } from "@/lib/data";
import { ListTodo, Clock, CheckCircle2, TrendingUp, Users, FolderKanban } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const todoCount = MOCK_TASKS.filter(t => t.status === 'todo').length;
  const progressCount = MOCK_TASKS.filter(t => t.status === 'in_progress').length;
  const completedCount = MOCK_TASKS.filter(t => t.status === 'completed').length;
  const totalCount = MOCK_TASKS.length;
  const teamCount = MOCK_MEMBERS.length;

  const stats = [
    { label: "Total Tasks", value: totalCount, icon: TrendingUp, color: "bg-primary text-primary-foreground" },
    { label: "To Do", value: todoCount, icon: ListTodo, color: "bg-info text-info-foreground" },
    { label: "In Progress", value: progressCount, icon: Clock, color: "bg-warning text-warning-foreground" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-success text-success-foreground" },
  ];

  // Pie chart data
  const pieData = [
    { name: "Completed", value: completedCount, color: "hsl(152, 60%, 42%)" },
    { name: "In Progress", value: progressCount, color: "hsl(38, 92%, 50%)" },
    { name: "To Do", value: todoCount, color: "hsl(210, 80%, 55%)" },
  ];

  // Bar chart - tasks per category
  const categoryData = (Object.keys(CATEGORY_LABELS) as TaskCategory[]).map(cat => ({
    name: CATEGORY_LABELS[cat].split(' ')[0],
    tasks: MOCK_TASKS.filter(t => t.category === cat).length,
    completed: MOCK_TASKS.filter(t => t.category === cat && t.status === 'completed').length,
  }));

  // Priority distribution
  const highPriority = MOCK_TASKS.filter(t => t.priority === 'high').length;
  const medPriority = MOCK_TASKS.filter(t => t.priority === 'medium').length;
  const lowPriority = MOCK_TASKS.filter(t => t.priority === 'low').length;

  const recentTasks = MOCK_TASKS.slice(0, 5);

  // Upcoming deadlines
  const upcomingTasks = [...MOCK_TASKS]
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Rasel! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
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

      {/* Extra stats row */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-display font-bold text-foreground">{teamCount}</p>
            <p className="text-xs text-muted-foreground">Team Members</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-display font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Departments</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pie Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Task Status Overview</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
            {pieData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Tasks by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} barGap={8}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="tasks" fill="hsl(210, 80%, 55%)" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="completed" fill="hsl(152, 60%, 42%)" radius={[6, 6, 0, 0]} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground">Overall Progress</h3>
          <span className="text-lg font-display font-bold text-secondary">
            {Math.round((completedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
          <div className="h-full bg-success transition-all rounded-l-full" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
          <div className="h-full bg-warning transition-all" style={{ width: `${(progressCount / totalCount) * 100}%` }} />
          <div className="h-full bg-info transition-all rounded-r-full" style={{ width: `${(todoCount / totalCount) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Completed</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> In Progress</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-info" /> To Do</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {[
              { label: "High Priority", count: highPriority, color: "bg-destructive", total: totalCount },
              { label: "Medium Priority", count: medPriority, color: "bg-warning", total: totalCount },
              { label: "Low Priority", count: lowPriority, color: "bg-info", total: totalCount },
            ].map(p => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{p.label}</span>
                  <span className="text-muted-foreground">{p.count} tasks</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${(p.count / p.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingTasks.map(task => {
              const daysLeft = Math.ceil((new Date(task.deadline).getTime() - new Date("2026-03-21").getTime()) / (1000 * 60 * 60 * 24));
              const member = MOCK_MEMBERS.find(m => m.id === task.assignedTo);
              return (
                <div key={task.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground">{member?.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ml-2 ${
                    daysLeft <= 3 ? 'bg-destructive/15 text-destructive' : daysLeft <= 7 ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {daysLeft}d left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card rounded-xl p-5 mt-6">
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
