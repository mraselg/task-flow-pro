import { useState } from "react";
import { X } from "lucide-react";
import { useAddTeamMember, CATEGORY_LABELS } from "@/hooks/useSupabaseData";
import { toast } from "@/hooks/use-toast";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
}

const AddMemberModal = ({ open, onClose }: AddMemberModalProps) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"web_design" | "digital_marketing" | "graphic_video">("web_design");
  const [role, setRole] = useState<"main_agent" | "sub_agent">("sub_agent");
  const [description, setDescription] = useState("");
  const [workPrompt, setWorkPrompt] = useState("");
  const addMember = useAddTeamMember();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember.mutateAsync({
        name,
        title,
        category,
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Department</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Role</label>
              <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="main_agent">Main Agent</option>
                <option value="sub_agent">Sub Agent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." rows={2} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Work Instructions</label>
            <textarea value={workPrompt} onChange={e => setWorkPrompt(e.target.value)} placeholder="Define responsibilities..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button type="submit" disabled={addMember.isPending} className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {addMember.isPending ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
