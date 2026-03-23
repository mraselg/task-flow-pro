import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useAddTask, useTeamMembers, CATEGORY_LABELS } from "@/hooks/useSupabaseData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

type TaskCategory = "web_design" | "digital_marketing" | "graphic_video";

const AddTaskModal = ({ open, onClose }: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("web_design");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const { user } = useAuth();
  const addTask = useAddTask();
  const { data: members = [] } = useTeamMembers();

  if (!open) return null;

  const assignableMembers = members.filter(m => m.role === "main_agent" || m.role === "sub_agent");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask.mutateAsync({
        title,
        description,
        category,
        deadline: deadline || null,
        priority,
        assigned_to: assignedTo || null,
        created_by: user?.id || null,
      });
      toast({ title: "Task created", description: `"${title}" has been added` });
      onClose();
      setTitle(""); setDescription(""); setDeadline(""); setAssignedTo("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg text-foreground">Create New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Task Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title..." required className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the task..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as "low" | "medium" | "high")} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Assign To</label>
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Unassigned</option>
              {assignableMembers.map(m => <option key={m.id} value={m.id}>{m.name} ({m.title})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Attachments</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Click or drag files to upload</p>
            </div>
          </div>
          <button type="submit" disabled={addTask.isPending} className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {addTask.isPending ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
