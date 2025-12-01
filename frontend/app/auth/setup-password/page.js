"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SetupPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
    setTempToken(searchParams.get("temp_token") || "");
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch('/api/auth-supabase/setup-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to complete profile");
      } else {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.dispatchEvent(new Event("authchange"));
        }
        setSuccess("Profile completed! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Complete Your Profile</h2>
        <p className="text-gray-500 mb-4 text-center">Enter your phone number and set a password to finish signing up.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="10-digit phone number"
              maxLength={10}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="Set a password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
} 
