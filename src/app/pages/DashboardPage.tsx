import { CheckCircle2, Clock, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export function DashboardPage() {
  const stats = [
    { label: "Active Projects", value: "12", icon: Activity, trend: "+2 this week" },
    { label: "Tasks Due", value: "24", icon: Clock, trend: "5 due today" },
    { label: "Completed", value: "148", icon: CheckCircle2, trend: "+12% vs last month" },
  ];

  const recentActivity = [
    { id: 1, user: "Sarah J.", action: "completed task", target: "Update design system", time: "2h ago", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, user: "Mike T.", action: "commented on", target: "API Integration", time: "4h ago", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, user: "Alex C.", action: "created project", target: "Q3 Marketing Site", time: "1d ago", avatar: "https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=100&h=100&fit=crop&crop=faces" },
  ];

  const activeProjects = [
    { id: 1, name: "Website Redesign", progress: 75, status: "On Track" },
    { id: 2, name: "Mobile App V2", progress: 32, status: "At Risk" },
    { id: 3, name: "API Documentation", progress: 90, status: "On Track" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Here's what's happening in your workspace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161618] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Projects</h2>
            <Link to="/app/projects" className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white dark:bg-[#161618] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            {activeProjects.map((project, i) => (
              <div key={project.id} className={`p-4 flex items-center justify-between ${i !== activeProjects.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Link to={`/app/projects/${project.id}`} className="font-medium hover:underline">{project.name}</Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      project.status === 'On Track' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>{project.status}</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="bg-white dark:bg-[#161618] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4">
            <div className="space-y-6">
              {recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex gap-3 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-[-16px] w-[1px] bg-neutral-200 dark:bg-neutral-800"></div>
                  )}
                  <img src={activity.avatar} alt={activity.user} className="w-8 h-8 rounded-full border border-white dark:border-[#161618] z-10" />
                  <div className="flex-1 text-sm pt-1">
                    <p>
                      <span className="font-medium text-neutral-900 dark:text-white">{activity.user}</span>{" "}
                      <span className="text-neutral-500">{activity.action}</span>{" "}
                      <span className="font-medium text-neutral-900 dark:text-white">{activity.target}</span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
