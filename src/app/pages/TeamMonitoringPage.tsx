import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  Mail,
  User as UserIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  Card, 
  CardContent, 
} from "../components/ui/card";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function TeamMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) throw error;

      // Map profiles to our display format
      const formattedMembers = (data || []).map(p => ({
        id: p.id,
        name: p.full_name || p.username || "Unknown Member",
        email: p.username || "No email",
        role: p.role || "Workspace Member",
        avatar: p.avatar_url,
        status: "Active", // Logic for active status could be added later
        workload: Math.floor(Math.random() * 100), // Random for now until tasks table is ready
        tasks: { active: 3, completed: 12, overdue: 0 },
        lastActive: "Today"
      }));

      setMembers(formattedMembers);
    } catch (error: any) {
      toast.error("Error loading team: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">User Monitoring</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Track team workload, task history, and real-time activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button 
            onClick={fetchTeamMembers}
            className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Total Members</p>
                <h3 className="text-2xl font-bold">{members.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Active Now</p>
                <h3 className="text-2xl font-bold">{members.filter(m => m.status === 'Active').length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Issues Detected</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Syncing team data...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <UserIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>No members found in this workspace.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                  <th className="px-6 py-4 text-xs font-black text-neutral-400 uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-xs font-black text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-neutral-400 uppercase tracking-widest">Workload</th>
                  <th className="px-6 py-4 text-xs font-black text-neutral-400 uppercase tracking-widest">Last Active</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-neutral-100 dark:border-neutral-800">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">{member.name}</p>
                          <p className="text-xs text-neutral-500 font-medium">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        member.status === "Active" ? "bg-green-100 text-green-700" :
                        member.status === "Idle" ? "bg-neutral-100 text-neutral-700" :
                        "bg-red-100 text-red-700"
                      }`}>{member.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              member.workload > 80 ? "bg-red-500" : member.workload > 50 ? "bg-amber-500" : "bg-green-500"
                            }`} 
                            style={{ width: `${member.workload}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-neutral-500">{member.workload}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 font-medium">
                      {member.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
