

## Plan: RaselXmira Management System - Major Enhancement & Database Setup

This plan covers 8 major changes requested by the user, organized into clear implementation steps.

---

### 1. Profile Dropdown Menu (Top-right avatar)

Add a dropdown menu on the profile avatar in `HeaderBar.tsx` with options:
- **Our Model** - shows company/system info
- **Add Admin / Add User** - opens a form to add new team members
- **Change Password** - password change form
- **Logout** - logout action

Will use the existing `DropdownMenu` from shadcn/ui components.

### 2. Notification Bar Redesign

Redesign the notification dropdown in `HeaderBar.tsx`:
- Better visual hierarchy with grouped notifications (Today, Earlier)
- Swipe-to-dismiss on mobile
- Mark all as read button
- Responsive: full-screen sheet on mobile, dropdown on desktop
- Better icons, timestamps, and avatar integration

### 3. Default Dark Theme

Change `App.tsx` ThemeProvider `defaultTheme` from `"light"` to `"dark"`.

### 4. Agent/Sub-Agent Profile Modal with Work Prompts

Create a new `MemberProfileModal.tsx` component accessible from `TeamPage.tsx`:
- Clicking any agent/sub-agent opens a detailed profile window
- Shows: avatar, name, title, description, category, role
- **Work prompt/instructions** section - shows what the agent's responsibilities are
- **AI Agent assistant** selection - dropdown to select "Mira" as AI backup agent
- Admin can **edit** all fields (name, description, work prompts, skills)
- Shows assigned tasks list with edit capability

### 5. Dashboard Charts Merge

In `DashboardPage.tsx`, merge the two separate charts (PieChart + BarChart) into a single unified analytics card:
- Combined chart with tabs or a single composite visualization
- Cleaner, more functional design within one card

### 6. Main Admin Assistant "Mira"

Add a new team member to `MOCK_MEMBERS`:
- Name: "Mira", Role: `main_admin_assistant` (or use existing sub_agent role under super_admin)
- She's the AI agent who leads when admin is absent
- Default selected as AI agent for super admin
- Add to the Team page hierarchy under Super Admin

### 7. Database Schema & Lovable Cloud Setup

Create Supabase tables via migrations:

```text
Tables:
- profiles (id, user_id FK, name, title, role, category, avatar_url, description, work_prompt, ai_agent_enabled, ai_agent_id)
- user_roles (id, user_id FK, role enum)
- tasks (id, title, description, status, category, deadline, assigned_to, created_by, priority, created_at, updated_at)
- notifications (id, user_id, title, message, type, read, created_at)
- activities (id, task_id FK, user_id, action, comment, created_at)
- team_members (id, user_id FK, name, role, category, title, avatar_url, description, work_prompt, ai_agent_id)
```

Enable RLS on all tables. Create security definer function for role checks. Insert demo data.

### 8. Authentication, Real-time Data & File Storage

- Set up Supabase Auth (email/password login)
- Create login/signup pages and auth guards
- Replace all `MOCK_*` data with Supabase queries using `@tanstack/react-query`
- Set up Supabase Storage bucket for file attachments
- Wire up `AddTaskModal` to insert into database
- Real-time subscriptions for tasks and notifications

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/App.tsx` | Change default theme to dark, add auth routes |
| `src/components/HeaderBar.tsx` | Add profile dropdown, redesign notifications |
| `src/components/MemberProfileModal.tsx` | New - agent profile view/edit modal |
| `src/components/pages/TeamPage.tsx` | Add Mira, clickable profiles |
| `src/components/pages/DashboardPage.tsx` | Merge two charts into one |
| `src/components/pages/LoginPage.tsx` | New - auth page |
| `src/lib/data.ts` | Add Mira member, work_prompt fields |
| `src/integrations/supabase/` | Auto-generated client & types |
| `supabase/migrations/*.sql` | Database schema, RLS, demo data |
| `src/hooks/useAuth.tsx` | New - auth context & hooks |

### Implementation Order

1. Default dark theme (quick change)
2. Profile dropdown menu on avatar
3. Notification bar redesign
4. Member profile modal with edit & AI agent selection
5. Add "Mira" as admin assistant
6. Merge dashboard charts
7. Database migrations & schema
8. Authentication flow
9. Replace mock data with Supabase queries
10. File storage setup

### Technical Notes

- Database will use Lovable Cloud (Supabase) - user needs to enable it
- User roles stored in separate `user_roles` table per security best practices
- RLS policies use `security definer` function to prevent recursive checks
- Real-time subscriptions via Supabase channels for tasks & notifications
- File storage in a `task-attachments` bucket with RLS

