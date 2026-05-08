"use client";

import { motion } from "motion/react";
import { Sidebar } from "../../components/Sidebar";
import {
  Users, BookOpen, Plus, TrendingUp,
  Settings, BarChart3, GraduationCap,
  Calendar, Shield, Search, Filter,
  MoreVertical, ArrowUpRight, DollarSign,
  PieChart, Bell, Mail, Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
        } else {
          router.push("/");
        }
      } catch (e) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  if (!user) return null;

  const stats = [
    { label: "Total Students", value: "1,248", icon: Users, bg: "bg-[#4CAF50]", color: "text-[#4CAF50]" },
    { label: "Total Tutors", value: "32", icon: GraduationCap, bg: "bg-[#FF9800]", color: "text-[#FF9800]" },
    { label: "Active Courses", value: "11", icon: BookOpen, bg: "bg-[#03A9F4]", color: "text-[#03A9F4]" },
    { label: "Ongoing Classes", value: "8", icon: Calendar, bg: "bg-[#FFC107]", color: "text-[#FFC107]" },
  ];

  const recentSignups = [
    { name: "John Doe", email: "john@example.com", date: "2 mins ago", course: "UI/UX Design" },
    { name: "Sarah Smith", email: "sarah@example.com", date: "15 mins ago", course: "Data Analysis" },
    { name: "Mike Johnson", email: "mike@example.com", date: "1 hour ago", course: "Web Development" },
    { name: "Emily Brown", email: "emily@example.com", date: "3 hours ago", course: "GIS Masterclass" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F3F9] text-slate-800">
      <Sidebar userType="admin" />

      <main className="flex-1 overflow-y-auto">
        {/* Top Header - White */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 text-gray-500 cursor-pointer lg:hidden" />
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-64 border-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Mail className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.charAt(0) || "A"}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.firstName} {user?.lastName}</span>
              <Menu className="w-4 h-4 text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Sub Header - Light Purple strip */}
        <div className="bg-[#F3F0FF] px-6 py-3 flex justify-between items-center border-b border-indigo-50">
          <h2 className="text-[#6B5A9E] font-medium">Super Admin</h2>
          <div className="text-sm text-[#6B5A9E]">
            <Link href="/dashboard" className="hover:underline">Home</Link> <span className="mx-1">-</span> Super Admin
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (Stats & Quick Actions) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`${stat.bg} p-5 rounded-md flex items-center justify-between text-white shadow-sm`}
                  >
                    <div>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-xs font-medium opacity-90 mt-1 uppercase tracking-wide">{stat.label}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions (matches "Basic Information" section look) */}
              <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-700">Quick Actions</h3>
                  <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-600 flex items-center gap-1">
                    Manage <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Add Course", desc: "Create a new course catalog.", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Add Tutor", desc: "Onboard new instructors.", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Assign Tutor", desc: "Link courses to tutors.", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "View Reports", desc: "System and sales analytics.", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-50" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                      <div className={`w-10 h-10 rounded-md ${item.bg} flex items-center justify-center ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-700">{item.label}</h4>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Welcome, Recent Signups, Health) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Welcome Card */}
              <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, <span className="text-indigo-600">{user?.firstName}</span>
                  </h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-md">
                    Manage the entire Koyitech Africa platform from this control center. Review analytics, manage users, and configure system settings.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                      <BarChart3 className="w-4 h-4" /> Generate Report
                    </button>
                    <button className="px-5 py-2 border border-gray-200 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Settings className="w-4 h-4" /> System Settings
                    </button>
                  </div>
                </div>
                {/* Decorative element resembling the chart in the image */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden sm:block">
                  <BarChart3 className="w-64 h-64 -mb-10 -mr-10" />
                </div>
              </div>

              {/* Recent Signups (matches "Student Enrollment" section) */}
              <div className="bg-white rounded-md shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Recent Signups</h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Student</th>
                        <th className="px-6 py-3 font-medium">Course</th>
                        <th className="px-6 py-3 font-medium text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSignups.map((user, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              {user.course}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400 text-xs">
                            {user.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-100 text-center">
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                      View All Signups
                    </button>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white p-6 rounded-md shadow-sm border border-l-4 border-l-green-500 border-gray-100 flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-full text-green-500 mt-1">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">System Health: Optimal</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    All systems operational. Payment gateway (Paystack) responding normally. Server latency is at 24ms.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
