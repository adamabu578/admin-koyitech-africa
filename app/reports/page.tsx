"use client";

import { Sidebar } from "../../components/Sidebar";
import { Search, Bell, Mail, Menu, Filter, MoreVertical, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AdminReports() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (error: any) {
        console.error("Error fetching reports:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
          <h2 className="text-[#6B5A9E] font-medium">Platform Reports</h2>
          <div className="text-sm text-[#6B5A9E]">
            <Link href="/" className="hover:underline">Home</Link> <span className="mx-1">-</span> <Link href="/admin" className="hover:underline">Super Admin</Link> <span className="mx-1">-</span> Reports
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Generated Reports</h3>
                <p className="text-gray-500 text-sm">
                  Generate detailed system, sales, and enrollment reports.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  Generate New Report
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Report Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Date Generated</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Loading reports...
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No reports generated yet.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                              <Download className="w-4 h-4" />
                            </div>
                            <p className="font-medium text-gray-800">{report.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{report.type}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Ready' ? 'bg-green-100 text-green-700' : 
                            report.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>Showing {reports.length} entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
