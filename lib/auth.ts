import { supabase } from "./supabase";

export const auth = {
  signIn: async (email: string, password: string) => 
    await supabase.auth.signInWithPassword({ email, password }),
  signOut: async () => 
    await supabase.auth.signOut(),
  signUpAdmin: async (email: string, password: string, firstName: string, lastName: string) => 
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, role: "admin" },
      },
    }),
};
