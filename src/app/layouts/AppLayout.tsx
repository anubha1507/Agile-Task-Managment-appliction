import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, CheckSquare, BarChart2, Settings, Bell, Search, Sun, Moon, LogOut, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function AppLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Projects", href: "/app/projects", icon: CheckSquare },
    { name: "Team", href: "/app/team", icon: Users },
    { name: "Reports", href: "/app/reports", icon: BarChart2 },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-neutral-50 dark:bg-[#0E0E11] text-neutral-900 dark:text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] flex flex-col">
        <div className="h-14 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xs">▲</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AgileFlow</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/app"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-300"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || user?.email || "Alex Carter"}</p>
              <p className="text-xs text-neutral-500 truncate">Workspace Member</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shrink-0">
          <div className="flex items-center flex-1">
            <div className="relative w-64 group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-8 pl-9 pr-4 text-sm bg-neutral-100 dark:bg-neutral-800/50 border border-transparent rounded-md focus:outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-neutral-300 dark:focus:border-neutral-700 transition-all placeholder-neutral-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="text-[10px] font-sans font-medium text-neutral-400 bg-neutral-200 dark:bg-neutral-700 px-1.5 rounded">⌘</kbd>
                <kbd className="text-[10px] font-sans font-medium text-neutral-400 bg-neutral-200 dark:bg-neutral-700 px-1.5 rounded">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white dark:border-[#161618]"></span>
            </button>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-[#0E0E11]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
