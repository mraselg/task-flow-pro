import { X, CalendarDays, MessageSquare, Send, Clock, ArrowRight, UserCircle } from "lucide-react";
import { useState } from "react";
import { MOCK_MEMBERS, MOCK_ACTIVITIES, CATEGORY_LABELS, STATUS_LABELS, type Task, type TaskStatus } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

const STATUS_OPTIONS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-info/15 text-info border-info/30" },
  { id: "in_progress", label: "In Progress", color: "bg-warning/15 text-warning border-warning/30" },
  { id: "completed", label: "Completed", color: "bg-success/15 text-success border-success/30" },
];

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");

  if (!task) return null;

  const member = MOCK_MEMBERS.find(m => m.id === task.assignedTo);
  const creator = MOCK_MEMBERS.find(m => m.id === task.createdBy);
  const activities = MOCK_ACTIVITIES.filter(a => a.taskId === task.id);

  const daysLeft = Math.ceil((new Date(task.deadline).getTime() - new Date("2026-03-21").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
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
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "details" ? "text-secondary border-b-2 border-secondary" : "text-muted-foreground"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "activity" ? "text-secondary border-b-2 border-secondary" : "text-muted-foreground"
            }`}
          >
            Activity
            {activities.length > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted">{activities.length}</span>
            )}
          </button>
        </div>

        <div className="p-5">
          {activeTab === "details" ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-foreground leading-relaxed">{task.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</h4>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                        task.status === s.id ? s.color : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Assigned To</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {member && (
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-[9px] font-bold">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member?.name || "Unassigned"}</p>
                      <p className="text-[10px] text-muted-foreground">{member?.title}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Created By</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {creator && (
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback className="text-[9px] font-bold">{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{creator?.name}</p>
                      <p className="text-[10px] text-muted-foreground">{task.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Deadline</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{task.deadline}</p>
                  <p className={`text-[10px] font-medium ${daysLeft < 0 ? 'text-destructive' : daysLeft <= 3 ? 'text-warning' : 'text-success'}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                  </p>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Workflow</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <span>Admin</span><ArrowRight className="w-3 h-3" />
                    <span>Agent</span><ArrowRight className="w-3 h-3" />
                    <span>Sub</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {activities.map(act => {
                    const actMember = MOCK_MEMBERS.find(m => m.name === act.user);
                    return (
                      <div key={act.id} className="flex gap-3 relative">
                        <Avatar className="w-8 h-8 shrink-0 z-10">
                          {actMember ? (
                            <>
                              <AvatarImage src={actMember.avatar} alt={actMember.name} />
                              <AvatarFallback className="text-[9px] font-bold">{act.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="text-[9px] font-bold">{act.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground">
                            <span className="font-semibold">{act.user}</span>{' '}
                            <span className="text-muted-foreground">{act.action}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{act.timestamp}</p>
                          {act.comment && (
                            <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-foreground leading-relaxed">
                              {act.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button className="p-2.5 rounded-xl bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
