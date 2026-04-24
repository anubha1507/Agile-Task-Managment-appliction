import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  CheckCircle2, Circle, Clock, Star, 
  Calendar, Zap, Loader2, ListTodo, Plus
} from "lucide-react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("tasks").select("*, projects:project_id(name)").eq("assignee_id", user.id);
        setTasks(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      toast.success(newStatus === 'done' ? "Task completed!" : "Task reopened");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">My Workspace</h1>
          <p className="text-sm text-neutral-500">Focus on your assigned tasks for today.</p>
        </div>
        <div className="flex w-full md:w-auto">
           <button className="flex w-full items-center justify-center gap-2 px-4 py-3 md:py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 min-h-[44px]">
             <Plus className="w-4 h-4 md:w-4 md:h-4" /> New Task
           </button>
        </div>
      </div>

      {/* MEMBER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#161618] p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center">
           <p className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Open Tasks</p>
           <p className="text-xl md:text-2xl font-bold">{tasks.filter(t => t.status !== 'done').length}</p>
        </div>
        <div className="bg-white dark:bg-[#161618] p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center">
           <p className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Completed</p>
           <p className="text-xl md:text-2xl font-bold text-green-500">{tasks.filter(t => t.status === 'done').length}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white dark:bg-[#161618] p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center">
           <p className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Focus Score</p>
           <p className="text-xl md:text-2xl font-bold text-amber-500">84%</p>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-inherit">
           <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
             <ListTodo className="w-4 h-4 text-amber-500" /> Active Tasks
           </h3>
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">No tasks assigned yet.</div>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors flex items-center gap-3 md:gap-4 group active:bg-neutral-100 dark:active:bg-neutral-800">
                 <button onClick={() => toggleTask(t.id, t.status)} className="shrink-0 transition-transform active:scale-90 p-1 md:p-0">
                    {t.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 group-hover:text-amber-500 transition-colors" />
                    )}
                 </button>
                 <div className="flex-1 min-w-0">
                    <p className={cn("text-xs md:text-sm font-medium truncate", t.status === 'done' ? "text-neutral-400 line-through" : "text-neutral-900 dark:text-white")}>{t.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500 truncate">{t.projects?.name}</span>
                      <span className="text-[9px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest hidden sm:inline">• Priority High</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                   <Clock className="w-3 h-3 text-neutral-400 hidden sm:block" />
                   <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase">Today</span>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
