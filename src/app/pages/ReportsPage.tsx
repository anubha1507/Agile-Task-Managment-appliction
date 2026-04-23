import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, Calendar as CalendarIcon } from "lucide-react";

const taskData = [
  { name: "Mon", completed: 12, added: 8 },
  { name: "Tue", completed: 19, added: 10 },
  { name: "Wed", completed: 15, added: 12 },
  { name: "Thu", completed: 22, added: 5 },
  { name: "Fri", completed: 30, added: 15 },
  { name: "Sat", completed: 10, added: 2 },
  { name: "Sun", completed: 8, added: 1 },
];

const burndownData = [
  { day: "Day 1", remaining: 100, ideal: 100 },
  { day: "Day 2", remaining: 90, ideal: 85 },
  { day: "Day 3", remaining: 85, ideal: 71 },
  { day: "Day 4", remaining: 60, ideal: 57 },
  { day: "Day 5", remaining: 50, ideal: 42 },
  { day: "Day 6", remaining: 30, ideal: 28 },
  { day: "Day 7", remaining: 10, ideal: 14 },
  { day: "Day 8", remaining: 0, ideal: 0 },
];

export function ReportsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Reports</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Analyze your team's velocity and project health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <CalendarIcon className="w-4 h-4" /> Last 7 Days
          </button>
          <button className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <div className="bg-white dark:bg-[#161618] p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Task Velocity</h2>
            <p className="text-sm text-neutral-500">Tasks completed vs added over time.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart id="task-velocity" accessibilityLayer={false} data={taskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="added" name="Added" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-white dark:bg-[#161618] p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Sprint Burndown</h2>
            <p className="text-sm text-neutral-500">Remaining work in current sprint.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart id="sprint-burndown" accessibilityLayer={false} data={burndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="remaining" name="Actual Remaining" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ideal" name="Ideal Trend" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
