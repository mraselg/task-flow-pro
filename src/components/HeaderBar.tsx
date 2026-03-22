import { useState } from "react";
import { Search, Bell, X, ClipboardList, CheckCircle2, RefreshCw, MessageCircle, AlertTriangle, LogOut, UserPlus, KeyRound, Layers, ChevronRight, CheckCheck } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderBarProps {
  onSearch?: (query: string) => void;
}

const HeaderBar = ({ onSearch }: HeaderBarProps) => {
  const { signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    onSearch?.(val);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const TypeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'task_assigned': return <ClipboardList className={`${iconClass} text-info`} />;
      case 'task_completed': return <CheckCircle2 className={`${iconClass} text-success`} />;
      case 'task_updated': return <RefreshCw className={`${iconClass} text-warning`} />;
      case 'comment': return <MessageCircle className={`${iconClass} text-secondary`} />;
      case 'deadline': return <AlertTriangle className={`${iconClass} text-destructive`} />;
      default: return <ClipboardList className={`${iconClass} text-muted-foreground`} />;
    }
  };

  const NotificationList = () => (
    <>
      {/* Today section */}
      <div className="px-4 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today</p>
      </div>
      {notifications.filter(n => !n.read || n.time.includes('min') || n.time.includes('hour')).map(notif => (
        <div
          key={notif.id}
          className={`px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 ${
            !notif.read ? 'border-l-secondary bg-secondary/5' : 'border-l-transparent'
          }`}
        >
          <div className="flex gap-3 items-start">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={notif.avatar} />
              <AvatarFallback className="text-[9px] font-bold bg-muted">{notif.title[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <TypeIcon type={notif.type} />
                <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
              <p className="text-[10px] text-muted-foreground/50 mt-1">{notif.time}</p>
            </div>
          </div>
        </div>
      ))}
      {/* Earlier section */}
      {notifications.filter(n => n.read && n.time.includes('day')).length > 0 && (
        <>
          <div className="px-4 py-2 mt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Earlier</p>
          </div>
          {notifications.filter(n => n.read && n.time.includes('day')).map(notif => (
            <div
              key={notif.id}
              className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 border-l-transparent opacity-70"
            >
              <div className="flex gap-3 items-start">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={notif.avatar} />
                  <AvatarFallback className="text-[9px] font-bold bg-muted">{notif.title[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <TypeIcon type={notif.type} />
                    <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Mobile Logo */}
        <div className="lg:hidden">
          <h1 className="font-display text-lg font-bold text-foreground">
            Rasel<span className="text-secondary">X</span>mira
          </h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search tasks, members..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>

          <ThemeToggle />

          {/* Notification - Desktop dropdown */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-popover z-10">
                  <h3 className="font-display font-bold text-sm text-foreground">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] font-semibold text-secondary hover:text-secondary/80 transition-colors">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                      {unreadCount} new
                    </span>
                  </div>
                </div>
                <NotificationList />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notification - Mobile sheet */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-display text-base">Notifications</SheetTitle>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] font-semibold text-secondary">
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                        {unreadCount} new
                      </span>
                    </div>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto flex-1">
                  <NotificationList />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
                <Avatar className="w-9 h-9 cursor-pointer">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rasel" alt="Rasel Ahmed" />
                  <AvatarFallback className="stat-gradient text-primary-foreground text-xs font-bold font-display">RA</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Rasel Ahmed</p>
                <p className="text-[11px] text-muted-foreground">Super Admin</p>
              </div>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <Layers className="w-4 h-4" />
                <span>Our Model</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <UserPlus className="w-4 h-4" />
                <span>Add Admin / User</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search tasks, members..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => { setSearchOpen(false); handleSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderBar;
