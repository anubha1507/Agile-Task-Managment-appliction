import { Plus, LayoutGrid, List as ListIcon, MoreVertical, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  due_date: string;
  description: string;
}

export function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    due_date: "",
    status: "In Progress"
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to load projects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("projects")
        .insert([{
          ...newProject,
          user_id: user.id,
          progress: 0
        }])
        .select();

      if (error) throw error;

      toast.success("Project created successfully!");
      setShowCreateModal(false);
      setNewProject({ name: "", description: "", due_date: "", status: "In Progress" });
      fetchProjects();
    } catch (error: any) {
      toast.error("Error creating project: " + error.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Projects</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage and track all your active projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-md p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-sm ${view === "grid" ? "bg-neutral-100 dark:bg-neutral-800" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-sm ${view === "list" ? "bg-neutral-100 dark:bg-neutral-800" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}>
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-500 mb-4">No projects found. Create your first project to get started!</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="text-blue-500 hover:underline text-sm font-medium"
          >
            + Create your first project
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/app/projects/${project.id}`} className="block bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <Calendar className="w-3 h-3" /> Due {project.due_date || "No date"}
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-md" onClick={(e) => e.preventDefault()}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      project.status === 'Done' ? 'bg-green-500' : project.status === 'At Risk' ? 'bg-red-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#161618] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px]">
                    ?
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                  project.status === 'Done' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
                  project.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 
                  'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                }`}>{project.status}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 uppercase border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Progress</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr key={project.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${i !== projects.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''}`}>
                  <td className="px-6 py-4 font-medium">
                    <Link to={`/app/projects/${project.id}`} className="hover:underline">{project.name}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      project.status === 'Done' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
                      project.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                    }`}>{project.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                      </div>
                      <span className="text-xs text-neutral-500">{project.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{project.due_date || "N/A"}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-md">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <p className="text-sm text-neutral-500">Start a new initiative with your team.</p>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <input 
                  required
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Website Redesign"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <input 
                    type="date" 
                    value={newProject.due_date}
                    onChange={(e) => setNewProject({...newProject, due_date: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Status</label>
                  <select 
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
