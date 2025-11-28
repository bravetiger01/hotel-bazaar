"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check for error messages from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'account_exists') {
      const email = params.get('email') || '';
      setError(`An account with ${email} already exists. Please login with your password.`);
      // Pre-fill the email field
      setEmail(email);
    } else if (params.get('error') === 'oauth_failed') {
      setError("Google OAuth failed. Please try again.");
    } else if (params.get('message') === 'verification_sent') {
      setSuccess("Account created successfully! Please check your email to verify your account.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.dispatchEvent(new Event("authchange"));
        }
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/user/api/auth/google?from=login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Hotel Bazaar Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500 mb-4">Sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          {success && <div className="text-green-600 text-sm font-medium">{success}</div>}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg shadow-sm transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.13 2.7 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.6c-2.01 1.35-4.59 2.16-9 2.16-6.44 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-6 text-sm text-gray-500">
          Don&apos;t have an account? <a href="/signup" className="text-indigo-600 hover:underline font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
} 
