"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { useTheme } from "next-themes";

export default function Login() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure light mode is activated by default on mobile devices
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTheme("light");
    }
  }, [setTheme]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, first_name, last_name, status')
          .eq('id', data.user.id)
        .single();
        
      const rawRole = profile?.role || data.user.user_metadata?.role || 'student';
      
      // Strict role check for Admin platform
      if (rawRole !== 'admin') {
        toast.error("Access denied. Admin privileges required.");
        await supabase.auth.signOut();
        return;
      }
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || data.user.user_metadata?.firstName || '',
        lastName: profile?.last_name || data.user.user_metadata?.lastName || '',
        role: 'admin',
        status: profile?.status || 'active'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      toast.success("Welcome to Admin Dashboard!");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-sm w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-0 md:min-h-[700px]">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 p-4 h-64 md:h-auto min-h-[250px] md:min-h-0 shrink-0">
           <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
             <img 
               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
               alt="Campus Illustration" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply"></div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-14 flex flex-col justify-center relative flex-1">
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-full max-w-md mx-auto space-y-8"
           >
              <h2 className="text-4xl font-serif tracking-tight text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Admin Portal
              </h2>
              <p className="text-gray-500 text-sm">Please sign in to access the control center.</p>

              <form className="space-y-5 mt-8" onSubmit={handleLogin}>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-500">Admin Email</label>
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                    />
                 </div>

                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                       <label className="text-sm font-medium text-gray-500">Password</label>
                    </div>
                    <div className="relative">
                       <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                       />
                       <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                       >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                     </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3b4b96] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#2b3a7a] transition-colors disabled:opacity-50 mt-8"
                 >
                    {isLoading ? "Authenticating..." : "Log in to Admin"}
                 </button>
                 
                 <button
                    type="button"
                    onClick={() => {
                      const demoUser = {
                        id: "demo-admin-id",
                        email: "admin@demo.com",
                        firstName: "Demo",
                        lastName: "Admin",
                        role: "admin",
                        status: "active"
                      };
                      localStorage.setItem('currentUser', JSON.stringify(demoUser));
                      toast.success("Logged in as Demo Admin!");
                      router.push("/");
                    }}
                    className="w-full bg-indigo-50 text-indigo-700 py-3.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors mt-3"
                 >
                    Use Demo Account
                 </button>
              </form>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
