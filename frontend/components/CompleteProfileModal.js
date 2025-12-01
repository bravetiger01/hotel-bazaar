import { useState } from "react";

export default function CompleteProfileModal({ email, tempToken, onClose }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/user/setup-password", {
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
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
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