import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import WordRotator from "../components/WordRotator";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/app");
      }
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully signed up! You can now log in.");
        // Sometimes signUp automatically logs you in if email confirmation isn't required
        if (data.session) {
            navigate("/app");
        } else {
            navigate("/login");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0E0E11] text-neutral-900 dark:text-neutral-50 font-sans">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32">
        <div className="max-w-sm w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 rounded bg-neutral-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xs">▲</span>
            </div>
            <span className="font-semibold tracking-tight">AgileFlow</span>
          </div>

          <h1 className="text-2xl font-semibold mb-2 tracking-tight">Create an account</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Start organizing your projects today.</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" 
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full block text-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors mt-6 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Already have an account? <Link to="/login" className="text-neutral-900 dark:text-white hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1 relative bg-neutral-900 overflow-hidden items-center justify-center p-20">
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
            The next generation of <br />
            <span className="text-blue-500">Agile Management</span>
          </h2>
          <WordRotator />
          <p className="text-neutral-400 mt-12 max-w-sm mx-auto text-sm leading-relaxed">
            Join thousands of teams who ship faster and better with AgileFlow's modern workspace.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </div>
  );
}
