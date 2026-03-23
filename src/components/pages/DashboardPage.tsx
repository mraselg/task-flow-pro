import { ListTodo, Clock, CheckCircle2, TrendingUp, Users, FolderKanban, AlertTriangle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamMembers, useTasks, CATEGORY_LABELS, STATUS_LABELS } from "@/hooks/useSupabaseData";
import type { DbTask, DbTeamMember } from "@/hooks/useSupabaseData";

interface DashboardPageProps {
  onNavigate?: (tab: string, filter?: string) => void;
}

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers();

  if (tasksLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  const todoCount = tasks.filter(t => t.status === "todo").length;
  const progressCount = tasks.filter(t => t.status === "in_progress").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const totalCount = tasks.length;
  const teamCount = members.filter(m => m.role !== "main_admin_assistant").length;

  const stats = [
    { label: "Total Tasks", value: totalCount, icon: TrendingUp, color: "bg-primary text-primary-foreground", filter: "all" },
    { label: "To Do", value: todoCount, icon: ListTodo, color: "bg-info text-info-foreground", filter: "todo" },
    { label: "In Progress", value: progressCount, icon: Clock, color: "bg-warning text-warning-foreground", filter: "in_progress" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-success text-success-foreground", filter: "completed" },
  ];

  const statusData = [
    { name: "To Do", value: todoCount, fill: "hsl(210, 80%, 55%)" },
    { name: "In Progress", value: progressCount, fill: "hsl(38, 92%, 50%)" },
    { name: "Completed", value: completedCount, fill: "hsl(152, 60%, 42%)" },
  ];

  const categories = ["web_design", "digital_marketing", "graphic_video"] as const;
  const categoryData = categories.map(cat => ({
    name: CATEGORY_LABELS[cat]?.split(" ")[0] || cat,
    total: tasks.filter(t => t.category === cat).length,
    done: tasks.filter(t => t.category === cat && t.status === "completed").length,
    active: tasks.filter(t => t.category === cat && t.status === "in_progress").length,
  }));

  const highPriority = tasks.filter(t => t.priority === "high").length;
  const medPriority = tasks.filter(t => t.priority === "medium").length;
  const lowPriority = tasks.filter(t => t.priority === "low").length;

  const upcomingTasks = [...tasks]
    .filter(t => t.status !== "completed" && t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 4);

  const getMember = (id: string | null) => members.find(m => m.id === id);

  const today = new Date();

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate?.("tasks", stat.filter)}
            className="glass-card rounded-xl p-4 lg:p-5 text-left hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Team & Dept - Clickable */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
        <button
          onClick={() => onNavigate?.("team")}
          className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-display font-bold text-foreground">{teamCount}</p>
            <p className="text-xs text-muted-foreground">Team Members</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate?.("team")}
          className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-display font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Departments</p>
          </div>
        </button>
      </div>

      {/* Unified Analytics */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <Tabs defaultValue="status">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Analytics Overview</h3>
            <TabsList className="bg-muted/50 h-8">
              <TabsTrigger value="status" className="text-[11px] h-7 px-3">By Status</TabsTrigger>
              <TabsTrigger value="department" className="text-[11px] h-7 px-3">By Dept</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="status" className="mt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "12px" }} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Tasks">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
              {statusData.map(d => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="department" className="mt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" fill="hsl(210, 80%, 55%)" radius={[6, 6, 0, 0]} name="Total" />
                <Bar dataKey="active" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} name="Active" />
                <Bar dataKey="done" fill="hsl(152, 60%, 42%)" radius={[6, 6, 0, 0]} name="Done" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {[
              { label: "High Priority", count: highPriority, color: "bg-destructive" },
              { label: "Medium Priority", count: medPriority, color: "bg-warning" },
              { label: "Low Priority", count: lowPriority, color: "bg-info" },
            ].map(p => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{p.label}</span>
                  <span className="text-muted-foreground">{p.count} tasks</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: totalCount ? `${(p.count / totalCount) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>}
            {upcomingTasks.map(task => {
              const daysLeft = Math.ceil((new Date(task.deadline!).getTime() - today.getTime()) / 86400000);
              const member = getMember(task.assigned_to);
              return (
                <button
                  key={task.id}
                  onClick={() => onNavigate?.("tasks", task.status)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 w-full text-left hover:bg-muted transition-colors"
                >
                  {member && (
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={member.avatar_url || ""} alt={member.name} />
                      <AvatarFallback className="text-[9px] font-bold">{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground">{member?.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                    daysLeft <= 3 ? "bg-destructive/15 text-destructive" : daysLeft <= 7 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
                  }`}>
                    {daysLeft <= 3 && <AlertTriangle className="w-3 h-3" />}
                    {daysLeft}d left
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card rounded-xl p-5 mt-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => {
            const member = getMember(task.assigned_to);
            return (
              <button
                key={task.id}
                onClick={() => onNavigate?.("tasks", task.status)}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full text-left"
              >
                {member && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar_url || ""} alt={member.name} />
                    <AvatarFallback className="text-[10px] font-bold">{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{member?.name} · {CATEGORY_LABELS[task.category] || task.category}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  task.status === "completed" ? "bg-success/15 text-success" :
                  task.status === "in_progress" ? "bg-warning/15 text-warning" :
                  "bg-info/15 text-info"
                }`}>
                  {STATUS_LABELS[task.status] || task.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
