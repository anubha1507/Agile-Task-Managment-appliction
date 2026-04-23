import { useState, useRef } from "react";
import { User, Users, Shield, Bell, Key, Plus, Trash2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=100&h=100&fit=crop&crop=faces");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Avatar updated successfully!");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "team", name: "Team Members", icon: Users },
    { id: "roles", name: "Roles & Permissions", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Key },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        {activeTab === "profile" && (
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6">Public Profile</h2>
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-20 h-20 border border-neutral-200 dark:border-neutral-800">
                <AvatarImage src={avatarUrl} alt="User Avatar" className="object-cover" />
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-xl font-bold">AC</AvatarFallback>
              </Avatar>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={triggerFileInput}
                  className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors mb-2 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change Avatar
                </button>
                <p className="text-xs text-neutral-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <form className="space-y-5 max-w-lg" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Last Name</label>
                  <input type="text" defaultValue="Carter" className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</label>
                <input type="email" defaultValue="alex@agileflow.app" className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Bio</label>
                <textarea rows={3} defaultValue="Product Lead building awesome tools." className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all resize-none"></textarea>
              </div>
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button className="bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "team" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Team Members</h2>
                <p className="text-sm text-neutral-500">Manage who has access to this workspace.</p>
              </div>
              <button className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                <Plus className="w-4 h-4" /> Invite Member
              </button>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              {[
                { name: "Alex Carter", email: "alex@agileflow.app", role: "Owner", avatar: "https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=100&h=100&fit=crop&crop=faces" },
                { name: "Sarah Jenkins", email: "sarah@agileflow.app", role: "Admin", avatar: "https://i.pravatar.cc/150?u=1" },
                { name: "Mike Taylor", email: "mike@agileflow.app", role: "Member", avatar: "https://i.pravatar.cc/150?u=2" },
              ].map((member, i) => (
                <div key={i} className={`flex items-center justify-between p-4 ${i !== 2 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''}`}>
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800" />
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-neutral-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="text-sm bg-transparent border-none focus:ring-0 text-neutral-500 dark:text-neutral-400 font-medium cursor-pointer appearance-none outline-none">
                      <option>{member.role}</option>
                      {member.role !== "Owner" && (
                        <>
                          <option>Admin</option>
                          <option>Member</option>
                        </>
                      )}
                    </select>
                    {member.role !== "Owner" && (
                      <button className="text-neutral-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {["roles", "notifications", "security"].includes(activeTab) && (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center h-64">
            <h3 className="text-lg font-medium mb-2 capitalize">{activeTab} Settings</h3>
            <p className="text-sm text-neutral-500 max-w-sm">This section is currently under development. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
