import { Outlet, NavLink, useNavigate } from "react-router";
import { 
  LayoutDashboard, CheckSquare, BarChart2, Settings, Bell, Search, Sun, Moon, 
  LogOut, Users, MessageSquare, Briefcase, UserCheck, ShieldCheck, Zap, 
  Command, Cpu, Users2
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import { FullScreenLoader } from "../components/FullScreenLoader";

export function AppLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Try fetching from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        // Double check the role is present
        const resolvedRole = profileData.role || session.user.user_metadata?.role || "Member";
        setProfile({ ...profileData, role: resolvedRole });
      } else {
        // Fallback to auth metadata if profile row isn't found/ready
        setProfile({
          full_name: session.user.user_metadata?.full_name || "User",
          role: session.user.user_metadata?.role || "Member"
        });
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <FullScreenLoader />;

  const role = profile?.role || "Member";

  // Navigation Items with Role-Based Visibility
  const allNavItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard, roles: ["HR", "Team Leader", "Member"] },
    { name: "Projects", href: "/app/projects", icon: Briefcase, roles: ["Team Leader", "Member"] },
    { name: "Team", href: "/app/team", icon: Users, roles: ["Manager", "HR", "Team Leader"] },
    { name: "Reports", href: "/app/reports", icon: BarChart2, roles: ["Manager", "Team Leader"] },
    { name: "Community", href: "/app/community", icon: MessageSquare, roles: ["Manager", "HR", "Team Leader", "Member"] },
    { name: "Settings", href: "/app/settings", icon: Settings, roles: ["Manager", "HR", "Team Leader", "Member"] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-neutral-50 dark:bg-[#0E0E11] transition-colors duration-500">
      
      {/* UNIFIED SIDEBAR */}
      <aside className="w-64 border-r bg-white dark:bg-[#161618] border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-blue-500 fill-current" />
            <span className="font-bold text-sm tracking-tight">AgileFlow</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/app"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-inherit">
          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <img 
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=random`} 
              className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-neutral-900 dark:text-white">{profile?.full_name}</p>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                role === "HR" ? "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400" :
                role === "Manager" ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" :
                role === "Team Leader" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" :
                "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              )}>
                {role}
              </span>
            </div>
            <button onClick={handleLogout} className="p-1 text-neutral-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#161618] border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center flex-1">
             <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick search..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 transition-all"
                />
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
               <Bell className="w-4 h-4" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#161618] rounded-full" />
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </button>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />
            <Settings className="w-4 h-4 text-neutral-500 cursor-pointer hover:text-neutral-900 dark:hover:text-white" />
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#FAFAFB] dark:bg-[#0E0E11]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
