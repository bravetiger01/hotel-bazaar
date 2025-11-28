"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed.");
      } else {
        setSuccess(data.message);
        setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        // Optionally redirect to login after a delay
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Hotel Bazaar Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-500 mb-4">Sign up to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
              maxLength={10}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <Button type="submit" className="w-full" loading={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <button
          onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/user/api/auth/google?from=signup`}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg shadow-sm transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.13 2.7 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.6c-2.01 1.35-4.59 2.16-9 2.16-6.44 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline font-medium">Login</a>
        </div>
      </div>
    </div>
  );
} 
