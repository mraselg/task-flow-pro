import { useState } from "react";
import { MOCK_MEMBERS, MOCK_TASKS, CATEGORY_LABELS, type TaskCategory, type TeamMember } from "@/lib/data";
import { Crown, Shield, Briefcase, CheckCircle2, Clock, Globe, TrendingUp, Palette, Bot, Sparkles, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MemberProfileModal from "@/components/MemberProfileModal";

const CATEGORIES: TaskCategory[] = ["web_design", "digital_marketing", "graphic_video"];

const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  web_design: <Globe className="w-5 h-5" />,
  digital_marketing: <TrendingUp className="w-5 h-5" />,
  graphic_video: <Palette className="w-5 h-5" />,
};

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const admin = MOCK_MEMBERS.find(m => m.role === 'super_admin');
  const mira = MOCK_MEMBERS.find(m => m.role === 'main_admin_assistant');

  const getMemberTaskStats = (memberId: string) => {
    const tasks = MOCK_TASKS.filter(t => t.assignedTo === memberId);
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
    };
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Team</h1>
        <p className="text-muted-foreground text-sm mt-1">Company hierarchy & members</p>
      </div>

      {/* Admin & Mira Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {admin && (
          <div
            className="stat-gradient rounded-xl p-5 text-primary-foreground cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setSelectedMember(admin)}
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-primary-foreground/20">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback className="rounded-2xl bg-primary-foreground/20 text-xl font-bold font-display">
                  {admin.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-medium opacity-80">Super Admin</span>
                </div>
                <h3 className="text-lg font-display font-bold">{admin.name}</h3>
                <p className="text-xs opacity-80">{admin.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
              <div className="text-center">
                <p className="text-xl font-display font-bold">{MOCK_TASKS.length}</p>
                <p className="text-[10px] opacity-70">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold">{MOCK_MEMBERS.filter(m => m.role !== 'super_admin' && m.role !== 'main_admin_assistant').length}</p>
                <p className="text-[10px] opacity-70">Team Members</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold">3</p>
                <p className="text-[10px] opacity-70">Departments</p>
              </div>
            </div>
          </div>
        )}

        {mira && (
          <div
            className="glass-card rounded-xl p-5 border-2 border-info/20 cursor-pointer hover:border-info/40 transition-colors"
            onClick={() => setSelectedMember(mira)}
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-info/30">
                <AvatarImage src={mira.avatar} alt={mira.name} />
                <AvatarFallback className="rounded-2xl bg-info/15 text-info text-xl font-bold font-display">M</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-info" />
                  <span className="text-xs font-medium text-info">AI Admin Assistant</span>
                  <Badge className="text-[9px] bg-info/15 text-info border-info/30 gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI
                  </Badge>
                </div>
                <h3 className="text-lg font-display font-bold text-foreground">{mira.name}</h3>
                <p className="text-xs text-muted-foreground">{mira.description}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground leading-relaxed">{mira.workPrompt}</p>
            </div>
          </div>
        )}
      </div>

      {/* Department Sections */}
      {CATEGORIES.map(cat => {
        const agents = MOCK_MEMBERS.filter(m => m.category === cat && m.role === 'main_agent');
        const subAgents = MOCK_MEMBERS.filter(m => m.category === cat && m.role === 'sub_agent');
        const catTasks = MOCK_TASKS.filter(t => t.category === cat);
        const catCompleted = catTasks.filter(t => t.status === 'completed').length;

        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-foreground text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  {CATEGORY_ICONS[cat]}
                </div>
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {catTasks.length} tasks
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  {catCompleted} done
                </span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full bg-success rounded-full transition-all" style={{ width: catTasks.length ? `${(catCompleted / catTasks.length) * 100}%` : '0%' }} />
            </div>

            {/* Main Agent */}
            {agents.map(agent => {
              const stats = getMemberTaskStats(agent.id);
              return (
                <div
                  key={agent.id}
                  className="glass-card rounded-xl p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMember(agent)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 rounded-xl">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback className="rounded-xl bg-info/15 text-info text-sm font-bold font-display">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-info" />
                        <span className="text-[10px] font-semibold text-info uppercase tracking-wider">{agent.title}</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{agent.name}</p>
                      {agent.workPrompt && (
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{agent.workPrompt}</p>
                      )}
                    </div>
                    {stats.total > 0 && (
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="text-center px-2">
                          <p className="text-sm font-bold text-foreground">{stats.total}</p>
                          <p className="text-[9px] text-muted-foreground">Tasks</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Sub Agents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4 border-l-2 border-border pl-4">
              {subAgents.map(sub => {
                const stats = getMemberTaskStats(sub.id);
                return (
                  <div
                    key={sub.id}
                    className="glass-card rounded-xl p-3.5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedMember(sub)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-xl">
                        <AvatarImage src={sub.avatar} alt={sub.name} />
                        <AvatarFallback className="rounded-xl bg-muted text-muted-foreground text-xs font-bold font-display">
                          {sub.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{sub.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{sub.title}</p>
                      </div>
                      {sub.aiAgentId && (
                        <Bot className="w-3.5 h-3.5 text-info shrink-0" />
                      )}
                    </div>
                    {sub.workPrompt && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-2">{sub.workPrompt}</p>
                    )}
                    {stats.total > 0 && (
                      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-border">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          {stats.completed} done
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3 text-warning" />
                          {stats.inProgress} active
                        </div>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <MemberProfileModal
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};

export default TeamPage;
