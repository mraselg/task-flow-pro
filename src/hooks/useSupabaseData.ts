import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type DbTeamMember = Tables<"team_members">;
export type DbTask = Tables<"tasks">;
export type DbActivity = Tables<"activities">;
export type DbNotification = Tables<"notifications">;

// ─── Team Members ────────────────────────────────────
export const useTeamMembers = () =>
  useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("role", { ascending: true });
      if (error) throw error;
      return data as DbTeamMember[];
    },
  });

export const useAddTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: TablesInsert<"team_members">) => {
      const { data, error } = await supabase.from("team_members").insert(member).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
};

export const useUpdateTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"team_members"> & { id: string }) => {
      const { data, error } = await supabase.from("team_members").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
};

// ─── Tasks ───────────────────────────────────────────
export const useTasks = () =>
  useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbTask[];
    },
  });

export const useAddTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: TablesInsert<"tasks">) => {
      const { data, error } = await supabase.from("tasks").insert(task).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"tasks"> & { id: string }) => {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

// ─── Activities ──────────────────────────────────────
export const useActivities = (taskId?: string) =>
  useQuery({
    queryKey: ["activities", taskId],
    queryFn: async () => {
      let query = supabase.from("activities").select("*").order("created_at", { ascending: true });
      if (taskId) query = query.eq("task_id", taskId);
      const { data, error } = await query;
      if (error) throw error;
      return data as DbActivity[];
    },
    enabled: !!taskId,
  });

export const useAddActivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (activity: TablesInsert<"activities">) => {
      const { data, error } = await supabase.from("activities").insert(activity).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["activities", vars.task_id] }),
  });
};

// ─── Notifications ───────────────────────────────────
export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbNotification[];
    },
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

// ─── Helpers ─────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  web_design: "Web Design & Dev",
  digital_marketing: "Digital Marketing",
  graphic_video: "Graphic & Video",
};

export const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};
