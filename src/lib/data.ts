export type UserRole = 'super_admin' | 'main_agent' | 'sub_agent';

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
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'comment';
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
  { id: '1', name: 'Rasel Ahmed', role: 'super_admin', category: 'web_design', title: 'Super Admin', avatar: '', description: 'Founder & CEO of RaselXmira' },
  { id: '2', name: 'Karim Hasan', role: 'main_agent', category: 'web_design', title: 'Project Manager', avatar: '', description: 'Web project coordinator' },
  { id: '3', name: 'Nadia Islam', role: 'sub_agent', category: 'web_design', title: 'UI/UX Specialist', avatar: '', description: 'User interface designer' },
  { id: '4', name: 'Tanvir Rahman', role: 'sub_agent', category: 'web_design', title: 'Frontend Developer', avatar: '', description: 'React & Tailwind expert' },
  { id: '5', name: 'Sumon Dev', role: 'sub_agent', category: 'web_design', title: 'Backend Developer', avatar: '', description: 'Node.js & database specialist' },
  { id: '6', name: 'Rima Khatun', role: 'main_agent', category: 'digital_marketing', title: 'Marketing Lead', avatar: '', description: 'Digital marketing strategist' },
  { id: '7', name: 'Fahim Khan', role: 'sub_agent', category: 'digital_marketing', title: 'SEO Specialist', avatar: '', description: 'Search engine optimization expert' },
  { id: '8', name: 'Mitu Akter', role: 'sub_agent', category: 'digital_marketing', title: 'Ad Campaign Expert', avatar: '', description: 'Facebook & Google Ads specialist' },
  { id: '9', name: 'Arif Hossain', role: 'sub_agent', category: 'digital_marketing', title: 'Content Writer', avatar: '', description: 'SEO content & copywriting' },
  { id: '10', name: 'Shakil Ahmed', role: 'main_agent', category: 'graphic_video', title: 'Creative Director', avatar: '', description: 'Visual design lead' },
  { id: '11', name: 'Luna Begum', role: 'sub_agent', category: 'graphic_video', title: 'Logo Designer', avatar: '', description: 'Brand identity specialist' },
  { id: '12', name: 'Jubayer Ali', role: 'sub_agent', category: 'graphic_video', title: 'Motion Graphics Editor', avatar: '', description: 'After Effects & animation' },
  { id: '13', name: 'Sadia Jahan', role: 'sub_agent', category: 'graphic_video', title: 'Color Grading Specialist', avatar: '', description: 'DaVinci Resolve expert' },
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
