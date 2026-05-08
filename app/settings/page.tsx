"use client";

import { Sidebar } from "../../components/Sidebar";
import { Search, Bell, Mail, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSettings() {
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
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F3F3F9] text-slate-800">
      <Sidebar userType="admin" />

      <main className="flex-1 overflow-y-auto">
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

        <div className="bg-[#F3F0FF] px-6 py-3 flex justify-between items-center border-b border-indigo-50">
          <h2 className="text-[#6B5A9E] font-medium">System Settings</h2>
          <div className="text-sm text-[#6B5A9E]">
            <Link href="/" className="hover:underline">Home</Link> <span className="mx-1">-</span> <Link href="/admin" className="hover:underline">Super Admin</Link> <span className="mx-1">-</span> Settings
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Configuration</h3>
            <p className="text-gray-500 text-sm">
              Manage platform branding, roles, permissions, and external integrations.
            </p>
            <div className="mt-8 border-2 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-400">
              Settings Form
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
