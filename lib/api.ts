import { supabase } from "./supabase";

export const api = {
  profiles: {
    getById: async (id: string) => 
      await supabase.from("profiles").select("role, first_name, last_name, status").eq("id", id).single(),
    upsert: async (data: any) => 
      await supabase.from("profiles").upsert(data),
    getStudents: async () => 
      await supabase.from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false }),
    getTutors: async () => 
      await supabase.from("profiles").select("*").in("role", ["instructor", "pending_instructor"]).order("created_at", { ascending: false }),
    getRecentUsers: async (limit: number = 5) => 
      await supabase.from("profiles").select("*").in("role", ["student", "instructor", "pending_instructor"]).order("created_at", { ascending: false }).limit(limit),
    getStudentCount: async () => 
      await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    getTutorCount: async () => 
      await supabase.from("profiles").select("*", { count: "exact", head: true }).in("role", ["instructor", "pending_instructor"]),
    updateStatus: async (id: string, status: string, role?: string) => {
      const updateData: any = { status };
      if (role) updateData.role = role;
      return await supabase.from("profiles").update(updateData).eq("id", id);
    }
  },

  courses: {
    getAllWithProfiles: async () => 
      await supabase.from("courses").select("*, profiles(first_name, last_name)").order("created_at", { ascending: false }),
    getCount: async () => 
      await supabase.from("courses").select("*", { count: "exact", head: true }),
  },

  reports: {
    getAll: async () => 
      await supabase.from("reports").select("*").order("created_at", { ascending: false }),
  }
};
