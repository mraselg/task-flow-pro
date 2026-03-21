import { MOCK_MEMBERS, CATEGORY_LABELS, type TaskCategory } from "@/lib/data";
import { Crown, Shield, User } from "lucide-react";

const ROLE_META = {
  super_admin: { label: "Super Admin", icon: Crown, color: "text-secondary" },
  main_agent: { label: "Department Head", icon: Shield, color: "text-info" },
  sub_agent: { label: "Specialist", icon: User, color: "text-muted-foreground" },
} as const;

const CATEGORIES: TaskCategory[] = ["web_design", "digital_marketing", "graphic_video"];

const TeamPage = () => {
  const admin = MOCK_MEMBERS.find(m => m.role === 'super_admin');

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Team</h1>
        <p className="text-muted-foreground text-sm mt-1">Company hierarchy & members</p>
      </div>

      {/* Admin Card */}
      {admin && (
        <div className="stat-gradient rounded-xl p-5 mb-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold font-display">
              {admin.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-medium opacity-80">Super Admin</span>
              </div>
              <h3 className="text-lg font-display font-bold">{admin.name}</h3>
              <p className="text-xs opacity-80">{admin.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Department Sections */}
      {CATEGORIES.map(cat => {
        const agents = MOCK_MEMBERS.filter(m => m.category === cat && m.role === 'main_agent');
        const subAgents = MOCK_MEMBERS.filter(m => m.category === cat && m.role === 'sub_agent');

        return (
          <div key={cat} className="mb-6">
            <h2 className="font-display font-bold text-foreground text-base mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary rounded-full" />
              {CATEGORY_LABELS[cat]}
            </h2>

            {/* Main Agent */}
            {agents.map(agent => (
              <div key={agent.id} className="glass-card rounded-xl p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-info/15 text-info flex items-center justify-center text-sm font-bold font-display">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-info" />
                      <span className="text-[10px] font-medium text-info">{agent.title}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Sub Agents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4 border-l-2 border-border pl-4">
              {subAgents.map(sub => (
                <div key={sub.id} className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold font-display">
                      {sub.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{sub.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{sub.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
