export type UserRole = 'super_admin' | 'main_admin_assistant' | 'main_agent' | 'sub_agent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskCategory = 'web_design' | 'digital_marketing' | 'graphic_video';

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  category: TaskCategory;
  title: string;
  avatar: string;
  description: string;
  workPrompt?: string;
  skills?: string[];
  aiAgentId?: string;
  isAiAgent?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  deadline: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'comment' | 'deadline';
  avatar?: string;
}

export interface Activity {
  id: string;
  taskId: string;
  user: string;
  action: string;
  timestamp: string;
  comment?: string;
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  web_design: 'Web Design & Dev',
  digital_marketing: 'Digital Marketing',
  graphic_video: 'Graphic & Video',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const MOCK_MEMBERS: TeamMember[] = [
  {
    id: '1', name: 'Rasel Ahmed', role: 'super_admin', category: 'web_design',
    title: 'Super Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rasel',
    description: 'Founder & CEO of RaselXmira',
    workPrompt: 'Oversee all projects, approve final deliverables, manage team structure and assignments.',
    skills: ['Leadership', 'Strategy', 'Project Management'],
    aiAgentId: 'mira',
  },
  {
    id: 'mira', name: 'Mira', role: 'main_admin_assistant', category: 'web_design',
    title: 'AI Admin Assistant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mira&backgroundColor=b6e3f4',
    description: 'AI-powered assistant that leads the team in the admin\'s absence',
    workPrompt: 'Coordinate all departments, assign tasks to agents, monitor deadlines, provide status reports, and ensure smooth workflow when the main admin is unavailable.',
    skills: ['AI Coordination', 'Task Management', 'Team Leadership', 'Auto-reporting'],
    isAiAgent: true,
  },
  {
    id: '2', name: 'Karim Hasan', role: 'main_agent', category: 'web_design',
    title: 'Project Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    description: 'Web project coordinator',
    workPrompt: 'Receive web development tasks from admin, break them into subtasks, assign to frontend/backend/QA specialists, review deliverables before submission.',
    skills: ['Project Coordination', 'Code Review', 'Agile'],
  },
  {
    id: '3', name: 'Nadia Islam', role: 'sub_agent', category: 'web_design',
    title: 'UI/UX Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia',
    description: 'User interface designer',
    workPrompt: 'Create wireframes, mockups, and prototypes. Conduct user research and usability testing. Deliver final UI designs in Figma.',
    skills: ['Figma', 'Wireframing', 'User Research'],
  },
  {
    id: '4', name: 'Tanvir Rahman', role: 'sub_agent', category: 'web_design',
    title: 'Frontend Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir',
    description: 'React & Tailwind expert',
    workPrompt: 'Convert UI designs into responsive React components. Implement client-side logic, animations, and API integrations.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: '5', name: 'Sumon Dev', role: 'sub_agent', category: 'web_design',
    title: 'Backend Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon',
    description: 'Node.js & database specialist',
    workPrompt: 'Build REST/GraphQL APIs, design database schemas, implement authentication, and optimize server performance.',
    skills: ['Node.js', 'PostgreSQL', 'REST API'],
  },
  {
    id: '6', name: 'Rima Khatun', role: 'main_agent', category: 'digital_marketing',
    title: 'Marketing Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rima',
    description: 'Digital marketing strategist',
    workPrompt: 'Plan and oversee all digital marketing campaigns. Coordinate SEO, ad campaigns, and content strategies. Report performance metrics.',
    skills: ['Strategy', 'Analytics', 'Campaign Management'],
  },
  {
    id: '7', name: 'Fahim Khan', role: 'sub_agent', category: 'digital_marketing',
    title: 'SEO Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fahim',
    description: 'Search engine optimization expert',
    workPrompt: 'Perform keyword research, on-page/off-page SEO audits, technical SEO fixes, and monthly ranking reports.',
    skills: ['SEO', 'Google Analytics', 'Keyword Research'],
  },
  {
    id: '8', name: 'Mitu Akter', role: 'sub_agent', category: 'digital_marketing',
    title: 'Ad Campaign Expert', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mitu',
    description: 'Facebook & Google Ads specialist',
    workPrompt: 'Create, manage, and optimize paid ad campaigns on Facebook, Google, and Instagram. Track ROI and A/B test creatives.',
    skills: ['Facebook Ads', 'Google Ads', 'A/B Testing'],
  },
  {
    id: '9', name: 'Arif Hossain', role: 'sub_agent', category: 'digital_marketing',
    title: 'Content Writer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arif',
    description: 'SEO content & copywriting',
    workPrompt: 'Write SEO-optimized blog posts, landing page copy, email newsletters, and social media content aligned with brand voice.',
    skills: ['Copywriting', 'SEO Writing', 'Content Strategy'],
  },
  {
    id: '10', name: 'Shakil Ahmed', role: 'main_agent', category: 'graphic_video',
    title: 'Creative Director', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shakil',
    description: 'Visual design lead',
    workPrompt: 'Lead creative direction for all visual assets. Review and approve designs, maintain brand consistency, manage creative team.',
    skills: ['Creative Direction', 'Brand Identity', 'Design Systems'],
  },
  {
    id: '11', name: 'Luna Begum', role: 'sub_agent', category: 'graphic_video',
    title: 'Logo Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    description: 'Brand identity specialist',
    workPrompt: 'Design logos, brand marks, and visual identity systems. Deliver multiple variations with brand guidelines document.',
    skills: ['Logo Design', 'Adobe Illustrator', 'Brand Guidelines'],
  },
  {
    id: '12', name: 'Jubayer Ali', role: 'sub_agent', category: 'graphic_video',
    title: 'Motion Graphics Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jubayer',
    description: 'After Effects & animation',
    workPrompt: 'Create motion graphics, video intros/outros, animated social media content, and product showcase videos.',
    skills: ['After Effects', 'Premiere Pro', 'Animation'],
  },
  {
    id: '13', name: 'Sadia Jahan', role: 'sub_agent', category: 'graphic_video',
    title: 'Color Grading Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadia',
    description: 'DaVinci Resolve expert',
    workPrompt: 'Apply professional color grading to videos, ensure visual consistency across projects, create LUTs for brand videos.',
    skills: ['DaVinci Resolve', 'Color Science', 'LUT Creation'],
  },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'E-commerce Website Redesign', description: 'Complete overhaul of the client e-commerce site with modern UI', status: 'in_progress', category: 'web_design', deadline: '2026-04-05', assignedTo: '4', createdBy: '1', createdAt: '2026-03-15', priority: 'high' },
  { id: '2', title: 'SEO Audit for ClientX', description: 'Full SEO audit and report generation', status: 'todo', category: 'digital_marketing', deadline: '2026-03-28', assignedTo: '7', createdBy: '1', createdAt: '2026-03-18', priority: 'medium' },
  { id: '3', title: 'Brand Logo Package', description: 'Design logo variations for new brand', status: 'completed', category: 'graphic_video', deadline: '2026-03-20', assignedTo: '11', createdBy: '1', createdAt: '2026-03-10', priority: 'high' },
  { id: '4', title: 'Facebook Ad Campaign', description: 'Set up and optimize FB ads for spring sale', status: 'in_progress', category: 'digital_marketing', deadline: '2026-03-30', assignedTo: '8', createdBy: '1', createdAt: '2026-03-16', priority: 'high' },
  { id: '5', title: 'Product Video Editing', description: 'Edit 3 product showcase videos', status: 'todo', category: 'graphic_video', deadline: '2026-04-02', assignedTo: '12', createdBy: '1', createdAt: '2026-03-19', priority: 'medium' },
  { id: '6', title: 'Landing Page Development', description: 'Build responsive landing page for campaign', status: 'todo', category: 'web_design', deadline: '2026-04-01', assignedTo: '3', createdBy: '1', createdAt: '2026-03-20', priority: 'low' },
  { id: '7', title: 'Blog Content Writing', description: 'Write 5 SEO-optimized blog articles', status: 'in_progress', category: 'digital_marketing', deadline: '2026-03-25', assignedTo: '9', createdBy: '1', createdAt: '2026-03-14', priority: 'medium' },
  { id: '8', title: 'API Integration', description: 'Integrate payment gateway API', status: 'completed', category: 'web_design', deadline: '2026-03-18', assignedTo: '5', createdBy: '1', createdAt: '2026-03-08', priority: 'high' },
  { id: '9', title: 'Social Media Graphics', description: 'Design 10 social media post templates', status: 'completed', category: 'graphic_video', deadline: '2026-03-17', assignedTo: '11', createdBy: '1', createdAt: '2026-03-07', priority: 'low' },
  { id: '10', title: 'Database Optimization', description: 'Optimize MongoDB queries and indexes', status: 'in_progress', category: 'web_design', deadline: '2026-03-27', assignedTo: '5', createdBy: '1', createdAt: '2026-03-17', priority: 'high' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Task Assigned', message: 'E-commerce Website Redesign has been assigned to Tanvir Rahman', time: '5 min ago', read: false, type: 'task_assigned', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir' },
  { id: '2', title: 'Task Completed', message: 'Brand Logo Package has been marked as completed by Luna Begum', time: '1 hour ago', read: false, type: 'task_completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' },
  { id: '3', title: 'New Comment', message: 'Karim Hasan commented on Landing Page Development', time: '2 hours ago', read: false, type: 'comment', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim' },
  { id: '4', title: 'Status Updated', message: 'Facebook Ad Campaign moved to In Progress', time: '3 hours ago', read: true, type: 'task_updated', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mitu' },
  { id: '5', title: 'Deadline Approaching', message: 'Blog Content Writing deadline is tomorrow', time: '5 hours ago', read: true, type: 'deadline', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arif' },
  { id: '6', title: 'Task Completed', message: 'API Integration completed by Sumon Dev', time: '1 day ago', read: true, type: 'task_completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon' },
  { id: '7', title: 'New Task Assigned', message: 'Product Video Editing assigned to Jubayer Ali', time: '1 day ago', read: true, type: 'task_assigned', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jubayer' },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', taskId: '1', user: 'Rasel Ahmed', action: 'created this task', timestamp: '2026-03-15 09:00' },
  { id: '2', taskId: '1', user: 'Karim Hasan', action: 'assigned to Tanvir Rahman', timestamp: '2026-03-15 10:30' },
  { id: '3', taskId: '1', user: 'Tanvir Rahman', action: 'changed status to In Progress', timestamp: '2026-03-16 08:00' },
  { id: '4', taskId: '1', user: 'Tanvir Rahman', action: 'left a comment', timestamp: '2026-03-18 14:00', comment: 'Homepage design is 60% complete. Working on product listing page next.' },
  { id: '5', taskId: '1', user: 'Karim Hasan', action: 'left a comment', timestamp: '2026-03-19 11:00', comment: 'Looking great! Please ensure mobile responsiveness is priority.' },
  { id: '6', taskId: '3', user: 'Rasel Ahmed', action: 'created this task', timestamp: '2026-03-10 09:00' },
  { id: '7', taskId: '3', user: 'Luna Begum', action: 'changed status to Completed', timestamp: '2026-03-20 16:00' },
  { id: '8', taskId: '3', user: 'Luna Begum', action: 'left a comment', timestamp: '2026-03-20 16:05', comment: '3 logo variations uploaded. Please review and approve.' },
  { id: '9', taskId: '4', user: 'Mitu Akter', action: 'left a comment', timestamp: '2026-03-20 10:00', comment: 'Campaign is live. Initial CTR is 3.2%, optimizing targeting.' },
];
