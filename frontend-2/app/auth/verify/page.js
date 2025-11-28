"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending"); // pending, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }
    const verify = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/verify-email?token=${token}`);
        const data = await res.json();  
        if (res.status === 400 && data.message && (
          data.message.includes("already verified") || data.message.includes("Invalid verification token"))
        ) {
          setStatus("info");
          setMessage(
            data.message.includes("already verified")
              ? "Your email is already verified. You can now log in."
              : "This verification link is invalid or has already been used. If you have already verified your email, you can log in."
          );
        } else if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => router.push("/login"), 2500);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };
    verify();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <img src="/logo.png" alt="Hotel Bazaar Logo" className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Email Verification</h2>
        {status === "pending" && (
          <div className="text-indigo-600 text-center mt-4">Verifying your email...</div>
        )}
        {status === "success" && (
          <div className="text-green-600 text-center mt-4">{message}<br/>Redirecting to login...</div>
        )}
        {status === "error" && (
          <div className="text-red-500 text-center mt-4">{message}</div>
        )}
        {status === "info" && (
          <div className="text-blue-500 text-center mt-4">{message}</div>
        )}
      </div>
    </div>
  );
}
