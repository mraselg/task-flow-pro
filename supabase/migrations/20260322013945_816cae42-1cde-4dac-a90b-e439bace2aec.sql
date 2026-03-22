
-- Fix permissive RLS policies (WITH CHECK (true))

-- Fix notifications INSERT: only allow inserting for admins/agents, not everyone
DROP POLICY "System can create notifications" ON public.notifications;
CREATE POLICY "Admins and agents can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'main_agent')
  );

-- Fix activities INSERT: only allow inserting for authenticated users who are part of the task
DROP POLICY "Authenticated users can create activities" ON public.activities;
CREATE POLICY "Authenticated users can create activities"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
