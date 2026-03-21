import { useState, useRef, useEffect } from "react";
import { Search, Bell, X } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/data";

interface HeaderBarProps {
  onSearch?: (query: string) => void;
}

const HeaderBar = ({ onSearch }: HeaderBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    onSearch?.(val);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return '📋';
      case 'task_completed': return '✅';
      case 'task_updated': return '🔄';
      case 'comment': return '💬';
      default: return '📌';
    }
  };

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

        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>

          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-xl border border-border shadow-xl max-h-[70vh] overflow-y-auto animate-fade-in z-50">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-display font-bold text-sm text-foreground">Notifications</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                    {unreadCount} new
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {MOCK_NOTIFICATIONS.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-secondary/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-lg shrink-0">{typeIcon(notif.type)}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-foreground">{notif.title}</p>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button className="w-full text-center text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button className="w-9 h-9 rounded-full stat-gradient text-primary-foreground flex items-center justify-center text-xs font-bold font-display">
            RA
          </button>
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
