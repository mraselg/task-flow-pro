import { useState } from "react";
import { LayoutDashboard, ListTodo, Plus, CalendarDays, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardPage from "@/components/pages/DashboardPage";
import TasksPage from "@/components/pages/TasksPage";
import CalendarPage from "@/components/pages/CalendarPage";
import TeamPage from "@/components/pages/TeamPage";
import AddTaskModal from "@/components/AddTaskModal";
import HeaderBar from "@/components/HeaderBar";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "add", label: "Add", icon: Plus },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "team", label: "Team", icon: Users },
] as const;

type TabId = "dashboard" | "tasks" | "calendar" | "team";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<string | undefined>();

  const handleNavClick = (id: string) => {
    if (id === "add") {
      setAddModalOpen(true);
    } else {
      setActiveTab(id as TabId);
      setTaskFilter(undefined);
    }
  };

  const handleNavigate = (tab: string, filter?: string) => {
    setActiveTab(tab as TabId);
    if (tab === "tasks" && filter) {
      setTaskFilter(filter);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          <h1 className="font-display text-xl font-bold text-sidebar-foreground">
            Rasel<span className="text-sidebar-primary">X</span>mira
          </h1>
          <p className="text-xs text-sidebar-foreground/50 mt-1">Management System</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.filter(i => i.id !== "add").map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0 lg:ml-64 overflow-y-auto">
        <HeaderBar onSearch={setGlobalSearch} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && <DashboardPage onNavigate={handleNavigate} />}
            {activeTab === "tasks" && <TasksPage searchQuery={globalSearch} initialFilter={taskFilter} />}
            {activeTab === "calendar" && <CalendarPage />}
            {activeTab === "team" && <TeamPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex items-center justify-around h-[var(--nav-height)]">
          {NAV_ITEMS.map((item) => {
            const isAdd = item.id === "add";
            const isActive = !isAdd && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isAdd ? "" : isActive ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                {isAdd ? (
                  <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center -mt-5 shadow-lg shadow-secondary/30">
                    <Plus className="w-6 h-6" />
                  </div>
                ) : (
                  <>
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default AppLayout;
