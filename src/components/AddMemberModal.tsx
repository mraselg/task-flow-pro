import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useAddTeamMember, CATEGORY_LABELS } from "@/hooks/useSupabaseData";
import { toast } from "@/hooks/use-toast";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = Object.entries(CATEGORY_LABELS);

const AddMemberModal = ({ open, onClose }: AddMemberModalProps) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("web_design");
  const [role, setRole] = useState<"main_agent" | "sub_agent">("sub_agent");
  const [description, setDescription] = useState("");
  const [workPrompt, setWorkPrompt] = useState("");
  const [customDepts, setCustomDepts] = useState<{ key: string; label: string }[]>([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [showAddDept, setShowAddDept] = useState(false);
  const addMember = useAddTeamMember();

  if (!open) return null;

  const allDepts = [
    ...DEFAULT_CATEGORIES.map(([k, v]) => ({ key: k, label: v })),
    ...customDepts,
  ];

  const handleAddDept = () => {
    if (!newDeptName.trim()) return;
    const key = newDeptName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (allDepts.some(d => d.key === key)) {
      toast({ title: "Department exists", variant: "destructive" });
      return;
    }
    setCustomDepts([...customDepts, { key, label: newDeptName.trim() }]);
    setCategory(key);
    setNewDeptName("");
    setShowAddDept(false);
  };

  const handleRemoveDept = (key: string) => {
    setCustomDepts(customDepts.filter(d => d.key !== key));
    if (category === key) setCategory("web_design");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only allow existing DB enum categories for now
    const validCategory = ["web_design", "digital_marketing", "graphic_video"].includes(category)
      ? category as "web_design" | "digital_marketing" | "graphic_video"
      : "web_design";
    try {
      await addMember.mutateAsync({
        name,
        title,
        category: validCategory,
        role,
        description,
        work_prompt: workPrompt || null,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      });
      toast({ title: "Member added", description: `${name} has been added to the team` });
      onClose();
      setName(""); setTitle(""); setDescription(""); setWorkPrompt("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg text-foreground">Add Team Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter name..." className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Title / Position</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Frontend Developer" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Department with Add/Edit */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground">Department</label>
              <button type="button" onClick={() => setShowAddDept(!showAddDept)} className="text-[10px] font-semibold text-accent hover:underline flex items-center gap-0.5">
                <Plus className="w-3 h-3" /> Add New
              </button>
            </div>

            {showAddDept && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  placeholder="New department name..."
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddDept())}
                />
                <button type="button" onClick={handleAddDept} className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">Add</button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {allDepts.map(dept => (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() => setCategory(dept.key)}
                  className={`relative group px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === dept.key
                      ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dept.label}
                  {customDepts.some(d => d.key === dept.key) && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleRemoveDept(dept.key); }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="main_agent">Main Agent</option>
              <option value="sub_agent">Sub Agent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." rows={2} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Work Instructions</label>
            <textarea value={workPrompt} onChange={e => setWorkPrompt(e.target.value)} placeholder="Define responsibilities..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button type="submit" disabled={addMember.isPending} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {addMember.isPending ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
