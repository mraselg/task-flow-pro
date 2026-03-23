import { useState } from "react";
import { X, Edit3, Save, Bot, Briefcase, FileText, Sparkles, Shield, Crown, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateTeamMember, CATEGORY_LABELS, STATUS_LABELS } from "@/hooks/useSupabaseData";
import type { DbTeamMember, DbTask } from "@/hooks/useSupabaseData";
import { toast } from "@/hooks/use-toast";

interface MemberProfileModalProps {
  member: DbTeamMember | null;
  open: boolean;
  onClose: () => void;
  members: DbTeamMember[];
  tasks: DbTask[];
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  main_admin_assistant: "Admin Assistant (AI)",
  main_agent: "Main Agent",
  sub_agent: "Sub Agent",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  super_admin: <Crown className="w-4 h-4" />,
  main_admin_assistant: <Bot className="w-4 h-4" />,
  main_agent: <Shield className="w-4 h-4" />,
  sub_agent: <User className="w-4 h-4" />,
};

const MemberProfileModal = ({ member, open, onClose, members, tasks }: MemberProfileModalProps) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editAiAgent, setEditAiAgent] = useState("");
  const updateMember = useUpdateTeamMember();

  if (!open || !member) return null;

  const memberTasks = tasks.filter(t => t.assigned_to === member.id);
  const aiAgent = member.ai_agent_id ? members.find(m => m.id === member.ai_agent_id) : null;

  const startEdit = () => {
    setEditName(member.name);
    setEditTitle(member.title || "");
    setEditDesc(member.description || "");
    setEditPrompt(member.work_prompt || "");
    setEditAiAgent(member.ai_agent_id || "");
    setEditing(true);
  };

  const saveEdit = async () => {
    try {
      await updateMember.mutateAsync({
        id: member.id,
        name: editName,
        title: editTitle,
        description: editDesc,
        work_prompt: editPrompt,
        ai_agent_id: editAiAgent || null,
      });
      toast({ title: "Profile updated" });
      setEditing(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const data = editing ? { ...member, name: editName, title: editTitle, description: editDesc, work_prompt: editPrompt, ai_agent_id: editAiAgent } : member;

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <div className="h-24 stat-gradient rounded-t-2xl" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!editing ? (
              <button onClick={startEdit} className="p-2 rounded-lg bg-card/20 backdrop-blur hover:bg-card/40 transition-colors"><Edit3 className="w-4 h-4 text-primary-foreground" /></button>
            ) : (
              <>
                <button onClick={saveEdit} disabled={updateMember.isPending} className="p-2 rounded-lg bg-success/80 hover:bg-success transition-colors"><Save className="w-4 h-4 text-success-foreground" /></button>
                <button onClick={() => setEditing(false)} className="p-2 rounded-lg bg-card/20 backdrop-blur hover:bg-card/40 transition-colors"><X className="w-4 h-4 text-primary-foreground" /></button>
              </>
            )}
            <button onClick={onClose} className="p-2 rounded-lg bg-card/20 backdrop-blur hover:bg-card/40 transition-colors"><X className="w-4 h-4 text-primary-foreground" /></button>
          </div>
          <div className="px-5 -mt-10">
            <Avatar className="w-20 h-20 rounded-2xl border-4 border-card shadow-lg">
              <AvatarImage src={data.avatar_url || ""} alt={data.name} />
              <AvatarFallback className="rounded-2xl bg-muted text-lg font-bold font-display">{data.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="px-5 pt-3 pb-2">
          {editing ? (
            <input value={editName} onChange={e => setEditName(e.target.value)} className="text-lg font-display font-bold text-foreground bg-muted rounded-lg px-3 py-1.5 w-full border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
          ) : (
            <h2 className="text-lg font-display font-bold text-foreground">{data.name}</h2>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className="gap-1 text-[10px]">{ROLE_ICONS[data.role]}{ROLE_LABELS[data.role] || data.role}</Badge>
            <Badge variant="outline" className="text-[10px]">{CATEGORY_LABELS[data.category]}</Badge>
            {data.is_ai_agent && <Badge className="gap-1 text-[10px] bg-info/15 text-info border-info/30"><Sparkles className="w-3 h-3" />AI Agent</Badge>}
          </div>
          {editing ? (
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5 w-full mt-2 border border-border focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Title / Position" />
          ) : (
            <p className="text-xs text-muted-foreground mt-1">{data.title}</p>
          )}
        </div>

        <div className="px-5 pb-5">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full bg-muted/50 mb-4">
              <TabsTrigger value="profile" className="flex-1 text-xs">Profile</TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1 text-xs">Tasks ({memberTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-0">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
                {editing ? (
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} />
                ) : (
                  <p className="text-sm text-foreground">{data.description || "No description"}</p>
                )}
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Work Instructions / Prompt</label>
                </div>
                {editing ? (
                  <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={3} placeholder="Define the agent's responsibilities..." />
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">{data.work_prompt || "No work instructions defined yet."}</p>
                )}
              </div>

              {(data.skills && data.skills.length > 0) && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Skills</label>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map(skill => <Badge key={skill} variant="outline" className="text-[10px] rounded-lg">{skill}</Badge>)}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-info" />
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Agent Assistant</label>
                </div>
                {editing ? (
                  <select value={editAiAgent} onChange={e => setEditAiAgent(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">No AI Agent</option>
                    {members.filter(m => m.is_ai_agent).map(ai => <option key={ai.id} value={ai.id}>{ai.name} - {ai.title}</option>)}
                  </select>
                ) : (
                  <div className="flex items-center gap-3">
                    {aiAgent ? (
                      <>
                        <Avatar className="w-8 h-8 rounded-lg"><AvatarImage src={aiAgent.avatar_url || ""} /><AvatarFallback className="rounded-lg bg-info/15 text-info text-xs font-bold">{aiAgent.name[0]}</AvatarFallback></Avatar>
                        <div><p className="text-xs font-semibold text-foreground">{aiAgent.name}</p><p className="text-[10px] text-muted-foreground">{aiAgent.title}</p></div>
                        <Badge className="ml-auto text-[9px] bg-info/15 text-info border-info/30 gap-1"><Sparkles className="w-2.5 h-2.5" />Active</Badge>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">No AI agent assigned</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              {memberTasks.length === 0 ? (
                <div className="text-center py-8"><Briefcase className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">No tasks assigned</p></div>
              ) : (
                <div className="space-y-2">
                  {memberTasks.map(task => (
                    <div key={task.id} className="glass-card rounded-xl p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{CATEGORY_LABELS[task.category]}</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-[9px] ${task.status === "completed" ? "bg-success/15 text-success border-success/30" : task.status === "in_progress" ? "bg-warning/15 text-warning border-warning/30" : "bg-info/15 text-info border-info/30"}`}>{STATUS_LABELS[task.status]}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span>Due: {task.deadline || "N/A"}</span>
                        <Badge variant="outline" className={`text-[9px] ${task.priority === "high" ? "text-destructive border-destructive/30" : task.priority === "medium" ? "text-warning border-warning/30" : "text-info border-info/30"}`}>{task.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
