"use client";
import { useState } from "react";
import { useEffect } from "react";

export default function LoginPage() {
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
      const res = await fetch('/api/auth-supabase/login', {
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
          
          // Fetch user profile to get userId for cart management
          try {
            const profileRes = await fetch('/api/auth-supabase/profile', {
              headers: { 'Authorization': `Bearer ${data.token}` }
            });
            if (profileRes.ok) {
              const userData = await profileRes.json();
              if (userData.id) {
                localStorage.setItem('userId', userData.id);
              }
            }
          } catch (err) {
            console.error('Failed to fetch user profile:', err);
          }
          
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
    window.location.href = '/api/auth-supabase/google?from=login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md glass-card p-8 space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Hotel Bazaar Logo" className="w-16 h-16 mb-2 rounded-lg" />
          <h2 className="text-3xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-gray-400 mb-4">Sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
          {success && <div className="text-green-400 text-sm font-medium">{success}</div>}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/50 text-white font-semibold py-3 rounded-full transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-white/10" />
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-white/10" />
        </div>
        <a
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 glass border border-white/10 hover:bg-white/5 text-gray-300 font-semibold py-3 rounded-full transition cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.13 2.7 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.6c-2.01 1.35-4.59 2.16-9 2.16-6.44 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </a>
        <div className="text-center mt-6 text-sm text-gray-400">
          Don&apos;t have an account? <a href="/signup" className="text-blue-400 hover:underline font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
} 
