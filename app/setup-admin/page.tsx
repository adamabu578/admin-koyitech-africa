"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../lib/api";

export default function SetupAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await api.auth.signUpAdmin(email, password, firstName, lastName);

      if (authError) throw authError;

      // 2. Explicitly update or create the profile with 'admin' role
      if (authData.user) {
        const { error: profileError } = await api.profiles.upsert({
          id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: "admin",
          status: "active",
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Profile Error:", profileError);
          // Don't throw here, sometimes RLS or triggers handle the profile creation automatically.
        }
      }

      toast.success("Admin account created successfully! You can now log in.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup First Admin</h2>
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <strong>Warning:</strong> Delete this page (`app/setup-admin/page.tsx`) immediately after creating your account to prevent unauthorized access.
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3b4b96] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2b3a7a] transition-colors disabled:opacity-50 mt-6"
          >
            {isLoading ? "Creating Admin..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
