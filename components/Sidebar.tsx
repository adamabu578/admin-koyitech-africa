"use client";

import { useState, useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, FileText,
  Upload, MessageSquare, Users,
  Settings, BarChart3, GraduationCap,
  Calendar, CheckSquare, PencilLine,
  User, LogOut, Menu, X, Sun, Moon
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  userType: "student" | "instructor" | "admin";
}

export function Sidebar({ userType }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studentLinks = [
    { path: "/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/courses", label: "My Courses", icon: BookOpen },
    { path: "/student/assignments", label: "Assignments", icon: CheckSquare },
    { path: "/student/classes", label: "Classes", icon: Calendar },
    { path: "/student/materials", label: "Materials", icon: FileText },
    { path: "/student/quizzes", label: "Quizzes", icon: PencilLine },
    { path: "/student/certificates", label: "Certificates", icon: GraduationCap },
    { path: "/student/profile", label: "Profile", icon: User },
  ];

  const instructorLinks = [
    { path: "/instructor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/instructor/courses", label: "My Courses", icon: BookOpen },
    { path: "/instructor/students", label: "Students", icon: Users },
    { path: "/instructor/classes", label: "Classes", icon: Calendar },
    { path: "/instructor/assignments", label: "Assignments", icon: CheckSquare },
    { path: "/instructor/quizzes", label: "Quizzes", icon: PencilLine },
    { path: "/instructor/materials", label: "Materials", icon: FileText },
    { path: "/instructor/messages", label: "Messages", icon: MessageSquare },
    { path: "/instructor/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/courses", label: "Courses", icon: BookOpen },
    { path: "/tutors", label: "Tutors", icon: GraduationCap },
    { path: "/students", label: "Students", icon: Users },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const links = userType === "student" ? studentLinks : userType === "instructor" ? instructorLinks : adminLinks;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-6 right-6 z-50 p-3 bg-primary dark:bg-white text-white dark:text-primary rounded-full shadow-2xl shadow-primary/30 dark:shadow-white/20 active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 left-0 z-50 h-[100dvh] w-72 bg-card border-r border-border flex flex-col py-8 transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-8 right-6 p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 mb-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-black tracking-tighter cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white italic text-xs shadow-lg shadow-primary/20">
              AA
            </div>
            <div className="flex flex-col leading-none">
              <span>KOYITECH</span>
              <span className="text-primary italic text-sm">AFRICA</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm uppercase tracking-widest ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-muted-foreground"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 border-t border-border pt-6 mt-6 shrink-0 space-y-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all font-bold text-sm uppercase tracking-widest"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
